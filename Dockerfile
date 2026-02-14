FROM debian:bullseye-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Download pre-built tzx2sna
RUN wget https://github.com/vlaadbrain/tzx2sna/releases/download/v1.4/tzx2sna-1.4-linux.zip -O /tmp/tzx2sna.zip && \
    unzip /tmp/tzx2sna.zip -d /tmp && \
    mv /tmp/tzx2sna /usr/local/bin/ && \
    chmod +x /usr/local/bin/tzx2sna && \
    rm /tmp/tzx2sna.zip

# Download pre-built tap2sna
RUN wget https://github.com/rhargreaves/tap2sna/releases/download/v1.1/tap2sna-linux64 -O /usr/local/bin/tap2sna && \
    chmod +x /usr/local/bin/tap2sna

COPY scripts/convert.sh /usr/local/bin/convert
RUN chmod +x /usr/local/bin/convert

WORKDIR /app