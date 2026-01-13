use axum::{
    routing::{get, post, put, delete},
    Router,
    Json,
    http::{StatusCode, header, Response},
    extract::{State, Path, Query},
    body::Body,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use common::AuthContext;
use std::sync::Arc;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres, FromRow};
use chrono::{NaiveDate, DateTime, Utc};
use genpdf::elements;
use genpdf::fonts;

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
struct Invoice {
    id: i32,
    user_id: i32,
    client_id: Option<i32>,
    #[sqlx(default)]
    client_name: Option<String>,
    #[sqlx(default)]
    client_email: Option<String>,
    invoice_number: String,
    status: String,
    total: f64,
    due_date: Option<NaiveDate>,
    notes: Option<String>,
    created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
struct InvoiceItem {
    id: i32,
    invoice_id: i32,
    description: String,
    quantity: f64,
    price: f64,
    amount: f64,
}

#[derive(Deserialize)]
struct CreateInvoiceRequest {
    client_id: Option<i32>,
    invoice_number: String,
    status: String,
    total: f64,
    due_date: Option<NaiveDate>,
    notes: Option<String>,
    items: Vec<CreateInvoiceItemRequest>,
}

#[derive(Deserialize)]
struct CreateInvoiceItemRequest {
    description: String,
    quantity: f64,
    price: f64,
    amount: f64,
}

#[derive(Serialize)]
struct InvoiceWithItems {
    #[serde(flatten)]
    invoice: Invoice,
    items: Vec<InvoiceItem>,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
struct Estimate {
    id: i32,
    user_id: i32,
    client_id: Option<i32>,
    #[sqlx(default)]
    client_name: Option<String>,
    estimate_number: String,
    status: String,
    total: f64,
    issue_date: Option<NaiveDate>,
    expiry_date: Option<NaiveDate>,
    created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
struct RecurringInvoice {
    id: i32,
    user_id: i32,
    client_id: Option<i32>,
    #[sqlx(default)]
    client_name: Option<String>,
    interval: String,
    interval_count: i32,
    start_date: NaiveDate,
    next_run: Option<NaiveDate>,
    last_run: Option<NaiveDate>,
    status: String,
    total: f64,
    created_at: Option<DateTime<Utc>>,
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
        .route("/api/invoices", get(list_invoices).post(create_invoice))
        .route("/api/invoices/:id", get(get_invoice).put(update_invoice).delete(delete_invoice))
        .route("/api/invoices/:id/pdf", get(generate_invoice_pdf))
        .route("/api/estimates", get(list_estimates).post(create_estimate))
        .route("/api/estimates/:id", get(get_estimate).put(update_estimate).delete(delete_estimate))
        .route("/api/recurring", get(list_recurring).post(create_recurring))
        .route("/api/recurring/:id", get(get_recurring).put(update_recurring).delete(delete_recurring))
        .route("/api/reports/dashboard-stats", get(get_dashboard_stats))
        .route("/api/reports/revenue", get(get_revenue_stats))
        .route("/api/reports/export", get(export_reports))
        .route("/api/invoices/:id/send", post(send_invoice_email))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5002));
    tracing::info!("Invoice service listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn list_invoices(auth: AuthContext, State(state): State<Arc<AppState>>) -> Result<Json<Vec<Invoice>>, (StatusCode, String)> {
    let invoices = sqlx::query_as::<_, Invoice>(
        "SELECT i.id, i.user_id, i.client_id, c.name as client_name, i.invoice_number, i.status, i.total::float8 as total, i.due_date, i.notes, i.created_at \
         FROM invoices i \
         LEFT JOIN clients c ON i.client_id = c.id \
         WHERE i.user_id = $1 ORDER BY i.created_at DESC"
    )
    .bind(auth.user_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(invoices))
}

async fn create_invoice(auth: AuthContext, State(state): State<Arc<AppState>>, Json(payload): Json<CreateInvoiceRequest>) -> Result<Json<InvoiceWithItems>, (StatusCode, String)> {
    let mut tx = state.db.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let invoice = sqlx::query_as::<_, Invoice>(
        "INSERT INTO invoices (user_id, client_id, invoice_number, status, total, due_date, notes) \
         VALUES ($1, $2, $3, $4, $5, $6, $7) \
         RETURNING id, user_id, client_id, invoice_number, status, total::float8 as total, due_date, notes, created_at"
    )
    .bind(auth.user_id)
    .bind(payload.client_id)
    .bind(payload.invoice_number)
    .bind(payload.status)
    .bind(payload.total)
    .bind(payload.due_date)
    .bind(payload.notes)
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let mut items = Vec::new();
    for i in payload.items {
        let item = sqlx::query_as::<_, InvoiceItem>("INSERT INTO invoice_items (invoice_id, description, quantity, price, amount) VALUES ($1, $2, $3, $4, $5) RETURNING id, invoice_id, description, quantity::float8 as quantity, price::float8 as price, amount::float8 as amount").bind(invoice.id).bind(i.description).bind(i.quantity).bind(i.price).bind(i.amount).fetch_one(&mut *tx).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        items.push(item);
    }
    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(InvoiceWithItems { invoice, items }))
}

async fn get_invoice(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<Json<InvoiceWithItems>, (StatusCode, String)> {
    let invoice = sqlx::query_as::<_, Invoice>(
        "SELECT i.id, i.user_id, i.client_id, c.name as client_name, c.email as client_email, i.invoice_number, i.status, i.total::float8 as total, i.due_date, i.notes, i.created_at \
         FROM invoices i \
         LEFT JOIN clients c ON i.client_id = c.id \
         WHERE i.id = $1 AND i.user_id = $2"
    )
    .bind(id)
    .bind(auth.user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or((StatusCode::NOT_FOUND, "Not found".to_string()))?;

    let items = sqlx::query_as::<_, InvoiceItem>("SELECT id, invoice_id, description, quantity::float8 as quantity, price::float8 as price, amount::float8 as amount FROM invoice_items WHERE invoice_id = $1").bind(id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(InvoiceWithItems { invoice, items }))
}

async fn update_invoice(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>, Json(payload): Json<CreateInvoiceRequest>) -> Result<Json<InvoiceWithItems>, (StatusCode, String)> {
    let mut tx = state.db.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let invoice = sqlx::query_as::<_, Invoice>("UPDATE invoices SET client_id = $1, invoice_number = $2, status = $3, total = $4, due_date = $5, notes = $6 WHERE id = $7 AND user_id = $8 RETURNING id, user_id, client_id, invoice_number, status, total::float8 as total, due_date, notes, created_at").bind(payload.client_id).bind(payload.invoice_number).bind(payload.status).bind(payload.total).bind(payload.due_date).bind(payload.notes).bind(id).bind(auth.user_id).fetch_one(&mut *tx).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    sqlx::query("DELETE FROM invoice_items WHERE invoice_id = $1").bind(id).execute(&mut *tx).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let mut items = Vec::new();
    for i in payload.items {
        let item = sqlx::query_as::<_, InvoiceItem>("INSERT INTO invoice_items (invoice_id, description, quantity, price, amount) VALUES ($1, $2, $3, $4, $5) RETURNING id, invoice_id, description, quantity::float8 as quantity, price::float8 as price, amount::float8 as amount").bind(invoice.id).bind(i.description).bind(i.quantity).bind(i.price).bind(i.amount).fetch_one(&mut *tx).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        items.push(item);
    }
    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(InvoiceWithItems { invoice, items }))
}

async fn delete_invoice(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<StatusCode, (StatusCode, String)> {
    sqlx::query("DELETE FROM invoices WHERE id = $1 AND user_id = $2").bind(id).bind(auth.user_id).execute(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(StatusCode::NO_CONTENT)
}

async fn generate_invoice_pdf(
    auth: AuthContext,
    Path(id): Path<i32>,
    State(state): State<Arc<AppState>>,
) -> Result<Response<Body>, (StatusCode, String)> {
    let invoice = sqlx::query_as::<_, Invoice>("SELECT i.id, i.user_id, i.client_id, c.name as client_name, i.invoice_number, i.status, i.total::float8 as total, i.due_date, i.notes, i.created_at FROM invoices i LEFT JOIN clients c ON i.client_id = c.id WHERE i.id = $1 AND i.user_id = $2").bind(id).bind(auth.user_id).fetch_optional(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?.ok_or((StatusCode::NOT_FOUND, "Not found".to_string()))?;
    let items = sqlx::query_as::<_, InvoiceItem>("SELECT id, invoice_id, description, quantity::float8 as quantity, price::float8 as price, amount::float8 as amount FROM invoice_items WHERE invoice_id = $1").bind(id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let font_family = fonts::from_files("/usr/share/fonts", "LiberationSans", None).ok();
    
    let mut buffer = Vec::new();
    if let Some(font_family) = font_family {
        let mut doc = genpdf::Document::new(font_family);
        doc.set_title(format!("Invoice {}", invoice.invoice_number));
        let mut decorator = genpdf::SimplePageDecorator::new();
        decorator.set_margins(10);
        doc.set_page_decorator(decorator);

        doc.push(elements::Text::new(format!("INVOICE #{}", invoice.invoice_number)).styled(genpdf::style::Effect::Bold));
        doc.push(elements::Text::new(format!("Client: {}", invoice.client_name.unwrap_or_default())));
        doc.push(elements::Text::new(format!("Date: {}", Utc::now().format("%Y-%m-%d"))));
        doc.push(elements::Break::new(1));
        
        for item in items {
            doc.push(elements::Text::new(format!("{} - {} x ${} = ${}", item.description, item.quantity, item.price, item.amount)));
        }
        
        doc.push(elements::Break::new(1));
        doc.push(elements::Text::new(format!("TOTAL: ${}", invoice.total)).styled(genpdf::style::Effect::Bold));

        doc.render_to_write(&mut buffer).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    } else {
        buffer.extend_from_slice(b"Invoice PDF Content (Simulated as fonts missing in build environment)\n\n");
        buffer.extend_from_slice(format!("Invoice: {}\n", invoice.invoice_number).as_bytes());
        buffer.extend_from_slice(format!("Client: {}\n", invoice.client_name.unwrap_or_default()).as_bytes());
        buffer.extend_from_slice(format!("Total: ${}\n", invoice.total).as_bytes());
    }

    Ok(Response::builder()
        .header(header::CONTENT_TYPE, "application/pdf")
        .header(header::CONTENT_DISPOSITION, format!("attachment; filename=\"invoice_{}.pdf\"", invoice.invoice_number))
        .body(Body::from(buffer))
        .unwrap())
}

// Estimates CRUD
async fn list_estimates(auth: AuthContext, State(state): State<Arc<AppState>>) -> Result<Json<Vec<Estimate>>, (StatusCode, String)> {
    let estimates = sqlx::query_as::<_, Estimate>("SELECT e.id, e.user_id, e.client_id, c.name as client_name, e.estimate_number, e.status, e.total::float8 as total, e.issue_date, e.expiry_date, e.created_at FROM estimates e LEFT JOIN clients c ON e.client_id = c.id WHERE e.user_id = $1").bind(auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(estimates))
}

async fn create_estimate(auth: AuthContext, State(state): State<Arc<AppState>>, Json(payload): Json<Estimate>) -> Result<Json<Estimate>, (StatusCode, String)> {
    let estimate = sqlx::query_as::<_, Estimate>("INSERT INTO estimates (user_id, client_id, estimate_number, status, total, issue_date, expiry_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, client_id, estimate_number, status, total::float8 as total, issue_date, expiry_date, created_at").bind(auth.user_id).bind(payload.client_id).bind(payload.estimate_number).bind(payload.status).bind(payload.total).bind(payload.issue_date).bind(payload.expiry_date).fetch_one(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(estimate))
}

async fn get_estimate(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<Json<Estimate>, (StatusCode, String)> {
    let e = sqlx::query_as::<_, Estimate>("SELECT e.id, e.user_id, e.client_id, c.name as client_name, e.estimate_number, e.status, e.total::float8 as total, e.issue_date, e.expiry_date, e.created_at FROM estimates e LEFT JOIN clients c ON e.client_id = c.id WHERE e.id = $1 AND e.user_id = $2").bind(id).bind(auth.user_id).fetch_optional(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?.ok_or((StatusCode::NOT_FOUND, "Not found".to_string()))?;
    Ok(Json(e))
}

async fn update_estimate(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>, Json(payload): Json<Estimate>) -> Result<Json<Estimate>, (StatusCode, String)> {
    let e = sqlx::query_as::<_, Estimate>("UPDATE estimates SET client_id = $1, estimate_number = $2, status = $3, total = $4, issue_date = $5, expiry_date = $6 WHERE id = $7 AND user_id = $8 RETURNING id, user_id, client_id, estimate_number, status, total::float8 as total, issue_date, expiry_date, created_at").bind(payload.client_id).bind(payload.estimate_number).bind(payload.status).bind(payload.total).bind(payload.issue_date).bind(payload.expiry_date).bind(id).bind(auth.user_id).fetch_one(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(e))
}

async fn delete_estimate(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<StatusCode, (StatusCode, String)> {
    sqlx::query("DELETE FROM estimates WHERE id = $1 AND user_id = $2").bind(id).bind(auth.user_id).execute(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(StatusCode::NO_CONTENT)
}

// Recurring CRUD
async fn list_recurring(auth: AuthContext, State(state): State<Arc<AppState>>) -> Result<Json<Vec<RecurringInvoice>>, (StatusCode, String)> {
    let r = sqlx::query_as::<_, RecurringInvoice>("SELECT r.id, r.user_id, r.client_id, c.name as client_name, r.interval, r.interval_count, r.start_date, r.next_run, r.last_run, r.status, r.total::float8 as total, r.created_at FROM recurring_invoices r LEFT JOIN clients c ON r.client_id = c.id WHERE r.user_id = $1").bind(auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(r))
}

async fn create_recurring(auth: AuthContext, State(state): State<Arc<AppState>>, Json(payload): Json<RecurringInvoice>) -> Result<Json<RecurringInvoice>, (StatusCode, String)> {
    let r = sqlx::query_as::<_, RecurringInvoice>("INSERT INTO recurring_invoices (user_id, client_id, interval, interval_count, start_date, next_run, status, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, user_id, client_id, interval, interval_count, start_date, next_run, last_run, status, total::float8 as total, created_at").bind(auth.user_id).bind(payload.client_id).bind(payload.interval).bind(payload.interval_count).bind(payload.start_date).bind(payload.next_run).bind(payload.status).bind(payload.total).fetch_one(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(r))
}

async fn get_recurring(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<Json<RecurringInvoice>, (StatusCode, String)> {
    let r = sqlx::query_as::<_, RecurringInvoice>("SELECT r.id, r.user_id, r.client_id, c.name as client_name, r.interval, r.interval_count, r.start_date, r.next_run, r.last_run, r.status, r.total::float8 as total, r.created_at FROM recurring_invoices r LEFT JOIN clients c ON r.client_id = c.id WHERE r.id = $1 AND r.user_id = $2").bind(id).bind(auth.user_id).fetch_optional(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?.ok_or((StatusCode::NOT_FOUND, "Not found".to_string()))?;
    Ok(Json(r))
}

async fn update_recurring(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>, Json(payload): Json<RecurringInvoice>) -> Result<Json<RecurringInvoice>, (StatusCode, String)> {
    let r = sqlx::query_as::<_, RecurringInvoice>("UPDATE recurring_invoices SET client_id = $1, interval = $2, interval_count = $3, start_date = $4, next_run = $5, status = $6, total = $7 WHERE id = $8 AND user_id = $9 RETURNING id, user_id, client_id, interval, interval_count, start_date, next_run, last_run, status, total::float8 as total, created_at").bind(payload.client_id).bind(payload.interval).bind(payload.interval_count).bind(payload.start_date).bind(payload.next_run).bind(payload.status).bind(payload.total).bind(id).bind(auth.user_id).fetch_one(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(r))
}

async fn delete_recurring(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<StatusCode, (StatusCode, String)> {
    sqlx::query("DELETE FROM recurring_invoices WHERE id = $1 AND user_id = $2").bind(id).bind(auth.user_id).execute(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Serialize)]
struct DashboardStats {
    invoice_stats: Vec<InvoiceStat>,
    revenue_stats: Vec<RevenueStat>,
    client_stats: ClientStats,
    overdue_stats: OverdueStats,
}

#[derive(Serialize, FromRow)]
struct InvoiceStat { status: String, count: i64, total_amount: f64 }
#[derive(Serialize, FromRow)]
struct RevenueStat { period: DateTime<Utc>, revenue: f64, collected: f64 }
#[derive(Serialize)]
struct ClientStats { total_clients: i64, active_clients: i64 }
#[derive(Serialize, FromRow)]
struct OverdueStats { overdue_count: i64, overdue_amount: f64 }

async fn get_dashboard_stats(auth: AuthContext, State(state): State<Arc<AppState>>) -> Result<Json<DashboardStats>, (StatusCode, String)> {
    let invoice_stats = sqlx::query_as::<_, InvoiceStat>("SELECT status, count(*) as count, sum(total)::float8 as total_amount FROM invoices WHERE user_id = $1 GROUP BY status").bind(auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let overdue_stats = sqlx::query_as::<_, OverdueStats>("SELECT count(*) as overdue_count, COALESCE(sum(total)::float8, 0) as overdue_amount FROM invoices WHERE user_id = $1 AND status = 'overdue'").bind(auth.user_id).fetch_one(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let total_clients: i64 = sqlx::query_scalar("SELECT count(*) FROM clients WHERE user_id = $1").bind(auth.user_id).fetch_one(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let revenue_stats = sqlx::query_as::<_, RevenueStat>("SELECT date_trunc('month', created_at) as period, sum(total)::float8 as revenue, sum(CASE WHEN status = 'paid' THEN total ELSE 0 END)::float8 as collected FROM invoices WHERE user_id = $1 GROUP BY period ORDER BY period DESC LIMIT 6").bind(auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DashboardStats {
        invoice_stats,
        revenue_stats,
        client_stats: ClientStats { total_clients, active_clients: total_clients },
        overdue_stats,
    }))
}

async fn get_revenue_stats(auth: AuthContext, State(state): State<Arc<AppState>>, Query(params): Query<std::collections::HashMap<String, String>>) -> Result<Json<Vec<RevenueStat>>, (StatusCode, String)> {
    let stats = sqlx::query_as::<_, RevenueStat>("SELECT date_trunc('month', created_at) as period, sum(total)::float8 as revenue, sum(CASE WHEN status = 'paid' THEN total ELSE 0 END)::float8 as collected FROM invoices WHERE user_id = $1 GROUP BY period ORDER BY period DESC").bind(auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(stats))
}

async fn export_reports(auth: AuthContext, State(state): State<Arc<AppState>>, Query(params): Query<std::collections::HashMap<String, String>>) -> Result<Response<Body>, (StatusCode, String)> {
    let export_type = params.get("type").map(|s| s.as_str()).unwrap_or("invoices");
    
    let csv_content = match export_type {
        "clients" => {
            let clients = sqlx::query!("SELECT name, email, phone FROM clients WHERE user_id = $1", auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
            let mut w = String::from("Name,Email,Phone\n");
            for c in clients {
                w.push_str(&format!("{},{},{}\n", c.name, c.email.unwrap_or_default(), c.phone.unwrap_or_default()));
            }
            w
        },
        "products" => {
            let products = sqlx::query!("SELECT name, price FROM products WHERE user_id = $1", auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
            let mut w = String::from("Name,Price\n");
            for p in products {
                w.push_str(&format!("{},{}\n", p.name, p.price));
            }
            w
        },
        _ => {
            let invoices = sqlx::query!("SELECT invoice_number, status, total FROM invoices WHERE user_id = $1", auth.user_id).fetch_all(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
            let mut w = String::from("Invoice Number,Status,Total\n");
            for i in invoices {
                w.push_str(&format!("{},{},{}\n", i.invoice_number, i.status, i.total));
            }
            w
        }
    };

    Ok(Response::builder()
        .header(header::CONTENT_TYPE, "text/csv")
        .header(header::CONTENT_DISPOSITION, format!("attachment; filename=\"{}_export.csv\"", export_type))
        .body(Body::from(csv_content))
        .unwrap())
}

async fn send_invoice_email(auth: AuthContext, Path(id): Path<i32>, State(state): State<Arc<AppState>>) -> Result<StatusCode, (StatusCode, String)> {
    let invoice = sqlx::query!("SELECT invoice_number FROM invoices WHERE id = $1 AND user_id = $2", id, auth.user_id).fetch_optional(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?.ok_or((StatusCode::NOT_FOUND, "Not found".to_string()))?;
    
    // Simulate sending email
    tracing::info!("Simulating sending email for invoice {}", invoice.invoice_number);
    
    sqlx::query("UPDATE invoices SET status = 'sent' WHERE id = $1 AND status = 'draft'").bind(id).execute(&state.db).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(StatusCode::OK)
}
