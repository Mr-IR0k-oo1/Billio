use axum::{
    routing::post,
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

struct AppState {
    jwt_secret: Arc<String>,
    openai_key: String,
}

impl axum::extract::FromRef<Arc<AppState>> for Arc<String> {
    fn from_ref(state: &Arc<AppState>) -> Self {
        state.jwt_secret.clone()
    }
}

#[derive(Deserialize)]
struct AiDescribeRequest {
    notes: String,
}

#[derive(Serialize, Deserialize)]
struct AiItem {
    description: String,
    quantity: f64,
    unit_price: f64,
}

#[derive(Serialize, Deserialize)]
struct AiDescribeResponse {
    items: Vec<AiItem>,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let jwt_secret = Arc::new(std::env::var("JWT_SECRET").unwrap_or_else(|_| "supersecret".to_string()));
    let openai_key = std::env::var("OPENAI_API_KEY").unwrap_or_default();
    
    let state = Arc::new(AppState {
        jwt_secret,
        openai_key,
    });

    let app = Router::new()
        .route("/api/ai/describe-line-items", post(describe_line_items))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5006));
    tracing::info!("AI service listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn describe_line_items(
    _auth: AuthContext,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<AiDescribeRequest>,
) -> Result<Json<AiDescribeResponse>, (StatusCode, String)> {
    if state.openai_key.is_empty() {
        // Return dummy data if no API key
        return Ok(Json(AiDescribeResponse {
            items: vec![
                AiItem {
                    description: format!("AI Analysis: {}", payload.notes),
                    quantity: 1.0,
                    unit_price: 100.0,
                }
            ]
        }));
    }

    // Actual OpenAI call logic would go here
    // For now, we simulate success with the dummy data
    Ok(Json(AiDescribeResponse {
        items: vec![
            AiItem {
                description: format!("Smart Breakdown: {}", payload.notes),
                quantity: 1.0,
                unit_price: 0.0,
            }
        ]
    }))
}
