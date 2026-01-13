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
struct Client {
    id: i32,
    user_id: i32,
    name: String,
    email: Option<String>,
    phone: Option<String>,
    address: Option<String>,
    tax_id: Option<String>,
    payment_terms: Option<i32>,
    notes: Option<String>,
    status: Option<String>,
}

#[derive(Deserialize)]
struct CreateClientRequest {
    name: String,
    email: Option<String>,
    phone: Option<String>,
    address: Option<String>,
    tax_id: Option<String>,
    payment_terms: Option<i32>,
    notes: Option<String>,
    status: Option<String>,
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
        .route("/api/clients", get(list_clients).post(create_client))
        .route("/api/clients/:id", get(get_client).put(update_client).delete(delete_client))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5003));
    tracing::info!("Client service listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn list_clients(
    auth: AuthContext,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Client>>, (StatusCode, String)> {
    let clients = sqlx::query_as::<_, Client>(
        "SELECT id, user_id, name, email, phone, address, tax_id, payment_terms, notes, status FROM clients WHERE user_id = $1"
    )
    .bind(auth.user_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(clients))
}

async fn create_client(
    auth: AuthContext,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateClientRequest>,
) -> Result<Json<Client>, (StatusCode, String)> {
    let client = sqlx::query_as::<_, Client>(
        "INSERT INTO clients (user_id, name, email, phone, address, tax_id, payment_terms, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, user_id, name, email, phone, address, tax_id, payment_terms, notes, status"
    )
    .bind(auth.user_id)
    .bind(payload.name)
    .bind(payload.email)
    .bind(payload.phone)
    .bind(payload.address)
    .bind(payload.tax_id)
    .bind(payload.payment_terms)
    .bind(payload.notes)
    .bind(payload.status)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(client))
}

async fn get_client(
    auth: AuthContext,
    Path(id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Client>, (StatusCode, String)> {
    let client = sqlx::query_as::<_, Client>(
        "SELECT id, user_id, name, email, phone, address, tax_id, payment_terms, notes, status FROM clients WHERE id = $1 AND user_id = $2"
    )
    .bind(id)
    .bind(auth.user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((StatusCode::NOT_FOUND, "Client not found".to_string()))?;

    Ok(Json(client))
}

async fn update_client(
    auth: AuthContext,
    Path(id): Path<i32>,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateClientRequest>,
) -> Result<Json<Client>, (StatusCode, String)> {
    let client = sqlx::query_as::<_, Client>(
        "UPDATE clients SET name = $1, email = $2, phone = $3, address = $4, tax_id = $5, payment_terms = $6, notes = $7, status = $8 WHERE id = $9 AND user_id = $10 RETURNING id, user_id, name, email, phone, address, tax_id, payment_terms, notes, status"
    )
    .bind(payload.name)
    .bind(payload.email)
    .bind(payload.phone)
    .bind(payload.address)
    .bind(payload.tax_id)
    .bind(payload.payment_terms)
    .bind(payload.notes)
    .bind(payload.status)
    .bind(id)
    .bind(auth.user_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(client))
}

async fn delete_client(
    auth: AuthContext,
    Path(id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> Result<StatusCode, (StatusCode, String)> {
    let result = sqlx::query("DELETE FROM clients WHERE id = $1 AND user_id = $2")
        .bind(id)
        .bind(auth.user_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "Client not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}
