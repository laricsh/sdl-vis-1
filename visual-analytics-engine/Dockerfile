FROM python:3

# See: https://github.com/phusion/baseimage-docker/issues/319
ARG DEBIAN_FRONTEND=noninteractive

# Create man dir, needed for DPKG of some packages
RUN mkdir -p /usr/share/man/man1

# Update package sources and install OS requirements
RUN apt-get update
RUN apt-get install -y --no-install-recommends \
  apt-utils
RUN apt-get install -y \
  python-dev \
  libpq-dev \
  default-jre-headless

# Install Python requirements
COPY requirements.txt /tmp/

RUN pip install --upgrade pip
RUN pip install -r /tmp/requirements.txt

# Copy PheonixDB client
COPY ./avatica-1.7.1.jar /tmp/avatica.jar
ENV AVATICA_JAR=/tmp/avatica.jar

# Make sure python output is printed directly to stdout
ENV PYTHONUNBUFFERED=1
