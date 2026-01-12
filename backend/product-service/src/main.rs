use axum::{
    routing::{get, post, put, delete},
    Router,
    Json,
    http::StatusCode,
    extract::{State, Path},
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use common::AuthContext;
use uuid::Uuid;
use std::sync::Arc;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres, FromRow};

type DbPool = Pool<Postgres>;

struct AppState {
    db: DbPool,
    jwt_secret: Arc<String>,
}

impl axum::extract::FromRef<Arc<AppState>> for Arc<String> {
    fn from_ref(state: &Arc<AppState>) -> Self {
        state.jwt_secret.clone()
    }
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
struct Product {
    id: Uuid,
    user_id: Uuid,
    name: String,
    description: Option<String>,
    price: f64,
}

#[derive(Deserialize)]
struct CreateProductRequest {
    name: String,
    description: Option<String>,
    price: f64,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    let jwt_secret = Arc::new(std::env::var("JWT_SECRET").unwrap_or_else(|_| "supersecret".to_string()));
    
    let state = Arc::new(AppState {
        db: pool,
        jwt_secret,
    });

    let app = Router::new()
        .route("/api/products", get(list_products).post(create_product))
        .route("/api/products/:id", get(get_product).put(update_product).delete(delete_product))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5004));
    tracing::info!("Product service listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn list_products(
    auth: AuthContext,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Product>>, (StatusCode, String)> {
    let products = sqlx::query_as!(
        Product,
        "SELECT id, user_id, name, description, price as \"price: f64\" FROM products WHERE user_id = $1",
        auth.user_id
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(products))
}

async fn create_product(
    auth: AuthContext,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateProductRequest>,
) -> Result<Json<Product>, (StatusCode, String)> {
    let product = sqlx::query_as!(
        Product,
        "INSERT INTO products (user_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING id, user_id, name, description, price as \"price: f64\"",
        auth.user_id,
        payload.name,
        payload.description,
        sqlx::types::BigDecimal::from_f64(payload.price).unwrap_or_default()
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(product))
}

async fn get_product(
    auth: AuthContext,
    Path(id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Product>, (StatusCode, String)> {
    let product = sqlx::query_as!(
        Product,
        "SELECT id, user_id, name, description, price as \"price: f64\" FROM products WHERE id = $1 AND user_id = $2",
        id,
        auth.user_id
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((StatusCode::NOT_FOUND, "Product not found".to_string()))?;

    Ok(Json(product))
}

async fn update_product(
    auth: AuthContext,
    Path(id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateProductRequest>,
) -> Result<Json<Product>, (StatusCode, String)> {
    let product = sqlx::query_as!(
        Product,
        "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 AND user_id = $5 RETURNING id, user_id, name, description, price as \"price: f64\"",
        payload.name,
        payload.description,
        sqlx::types::BigDecimal::from_f64(payload.price).unwrap_or_default(),
        id,
        auth.user_id
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(product))
}

async fn delete_product(
    auth: AuthContext,
    Path(id): Path<Uuid>,
    State(state): State<Arc<AppState>>,
) -> Result<StatusCode, (StatusCode, String)> {
    let result = sqlx::query("DELETE FROM products WHERE id = $1 AND user_id = $2")
        .bind(id)
        .bind(auth.user_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "Product not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}
