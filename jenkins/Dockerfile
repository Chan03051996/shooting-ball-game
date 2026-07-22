FROM jenkins/jenkins:lts

USER root

RUN apt-get update && \
    apt-get install -y \
        wget \
        unzip \
        curl \
        gnupg \
        lsb-release \
        ca-certificates && \
    wget -O- https://apt.releases.hashicorp.com/gpg | \
        gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(. /etc/os-release && echo $VERSION_CODENAME) main" > /etc/apt/sources.list.d/hashicorp.list && \
    apt-get update && \
    apt-get install -y terraform awscli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER jenkins
