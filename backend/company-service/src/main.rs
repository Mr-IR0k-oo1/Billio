use axum::{
    routing::{get, put},
    Router,
    Json,
    http::StatusCode,
    extract::State,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use common::AuthContext;
use std::sync::Arc;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres, FromRow};
use chrono::{DateTime, Utc};

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
struct CompanySettings {
    pub id: i32,
    pub user_id: i32,
    pub company_name: String,
    pub company_email: Option<String>,
    pub company_phone: Option<String>,
    pub company_address: Option<String>,
    pub company_website: Option<String>,
    pub tax_id: Option<String>,
    pub logo_url: Option<String>,
    pub invoice_prefix: Option<String>,
    pub invoice_starting_number: Option<i32>,
    pub estimate_prefix: Option<String>,
    pub estimate_starting_number: Option<i32>,
    pub default_payment_terms: Option<i32>,
    pub default_tax_rate: Option<f64>,
    pub default_currency: Option<String>,
    pub default_notes: Option<String>,
    pub default_terms: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
struct UpdateCompanyRequest {
    pub company_name: String,
    pub company_email: Option<String>,
    pub company_phone: Option<String>,
    pub company_address: Option<String>,
    pub company_website: Option<String>,
    pub tax_id: Option<String>,
    pub logo_url: Option<String>,
    pub invoice_prefix: Option<String>,
    pub invoice_starting_number: Option<i32>,
    pub estimate_prefix: Option<String>,
    pub estimate_starting_number: Option<i32>,
    pub default_payment_terms: Option<i32>,
    pub default_tax_rate: Option<f64>,
    pub default_currency: Option<String>,
    pub default_notes: Option<String>,
    pub default_terms: Option<String>,
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
        .route("/api/company", get(get_company).put(update_company))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5005));
    tracing::info!("Company service listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_company(
    auth: AuthContext,
    State(state): State<Arc<AppState>>,
) -> Result<Json<CompanySettings>, (StatusCode, String)> {
    let company = sqlx::query_as::<_, CompanySettings>(
        "SELECT * FROM companies WHERE user_id = $1"
    )
    .bind(auth.user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match company {
        Some(c) => Ok(Json(c)),
        None => {
            // Create default settings if not exists
            let c = sqlx::query_as::<_, CompanySettings>(
                "INSERT INTO companies (user_id, company_name) VALUES ($1, $2) RETURNING *"
            )
            .bind(auth.user_id)
            .bind("My Company")
            .fetch_one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
            Ok(Json(c))
        }
    }
}

async fn update_company(
    auth: AuthContext,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UpdateCompanyRequest>,
) -> Result<Json<CompanySettings>, (StatusCode, String)> {
    let company = sqlx::query_as::<_, CompanySettings>(
        "INSERT INTO companies (user_id, company_name, company_email, company_phone, company_address, company_website, tax_id, logo_url, invoice_prefix, invoice_starting_number, estimate_prefix, estimate_starting_number, default_payment_terms, default_tax_rate, default_currency, default_notes, default_terms) \
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) \
         ON CONFLICT (user_id) DO UPDATE SET \
         company_name = EXCLUDED.company_name, \
         company_email = EXCLUDED.company_email, \
         company_phone = EXCLUDED.company_phone, \
         company_address = EXCLUDED.company_address, \
         company_website = EXCLUDED.company_website, \
         tax_id = EXCLUDED.tax_id, \
         logo_url = EXCLUDED.logo_url, \
         invoice_prefix = EXCLUDED.invoice_prefix, \
         invoice_starting_number = EXCLUDED.invoice_starting_number, \
         estimate_prefix = EXCLUDED.estimate_prefix, \
         estimate_starting_number = EXCLUDED.estimate_starting_number, \
         default_payment_terms = EXCLUDED.default_payment_terms, \
         default_tax_rate = EXCLUDED.default_tax_rate, \
         default_currency = EXCLUDED.default_currency, \
         default_notes = EXCLUDED.default_notes, \
         default_terms = EXCLUDED.default_terms, \
         updated_at = NOW() \
         RETURNING *"
    )
    .bind(auth.user_id)
    .bind(payload.company_name)
    .bind(payload.company_email)
    .bind(payload.company_phone)
    .bind(payload.company_address)
    .bind(payload.company_website)
    .bind(payload.tax_id)
    .bind(payload.logo_url)
    .bind(payload.invoice_prefix)
    .bind(payload.invoice_starting_number)
    .bind(payload.estimate_prefix)
    .bind(payload.estimate_starting_number)
    .bind(payload.default_payment_terms)
    .bind(payload.default_tax_rate)
    .bind(payload.default_currency)
    .bind(payload.default_notes)
    .bind(payload.default_terms)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(company))
}
