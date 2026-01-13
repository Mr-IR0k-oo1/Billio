FROM rust:1.75-slim as builder

WORKDIR /app
COPY . .

RUN cargo build --release -p company-service

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/company-service /usr/local/bin/company-service
CMD ["company-service"]
