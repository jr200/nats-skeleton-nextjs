# get target architecture
LOCAL_ARCH := $(shell uname -m)
LOCAL_OS := $(shell uname -s)

# Default docker container and e2e test target.
TARGET_OS ?= linux
TARGET_ARCH ?= amd64

OUT_DIR := ./dist

.DEFAULT_GOAL := all

ifneq ($(wildcard ./private/charts/nats-skeleton-nextjs),)
VALUES_PATH := ./private/charts/nats-skeleton-nextjs/values.yaml
else
VALUES_PATH := ./charts/nats-skeleton-nextjs/values.yaml
endif

DOCKER_REGISTRY ?= ghcr.io/jr200
IMAGE_NAME ?= nats-skeleton-nextjs
K8S_NAMESPACE ?= nats-skeleton-nextjs


################################################################################
# Target: all
################################################################################
.PHONY: all
all:
	pnpm run dev

upgrade:
	pnpm add next@canary
	pnpm add next-auth@beta

build:
	pnpm run build

start:
	pnpm run start

################################################################################
# Target: docker-run                                                 #
################################################################################
.PHONY: docker-run
docker-run:
	podman run \
		--rm \
		--env-file .env \
		-p 3000:3000 \
		$(IMAGE_NAME):local

################################################################################
# Target: docker-debug
################################################################################
.PHONY: docker-debug
docker-debug:
	podman run \
		--rm \
		--env-file .env \
		-it \
		--entrypoint sh \
		-p 3000:3000 \
		$(IMAGE_NAME):local


################################################################################
# Target: docker-build                                                 #
################################################################################
.PHONY: docker-build
docker-build:
	podman build \
		-f docker/Dockerfile \
		-t $(IMAGE_NAME):local \
		--layers=true \
		.

################################################################################
# Target: helm chart dependencies
################################################################################
.PHONY: chart-deps
chart-deps:
	helm dependency build charts/nats-skeleton-nextjs --skip-refresh
	kubectl create namespace $(K8S_NAMESPACE) || echo "OK"

################################################################################
# Target: helm chart install
################################################################################
.PHONY: chart-install
chart-install: chart-deps
	helm upgrade -n $(K8S_NAMESPACE) nats-skeleton-nextjs \
		--install \
		--set vault-actions.bootstrapToken=$(VAULT_TOKEN) \
		-f $(VALUES_PATH) \
		charts/nats-skeleton-nextjs

################################################################################
# Target: helm template
################################################################################
.PHONY: chart-template
chart-template: chart-deps
	helm template -n $(K8S_NAMESPACE) nats-skeleton-nextjs \
		--set vault-actions.bootstrapToken=$(VAULT_TOKEN) \
		-f $(VALUES_PATH) \
		--debug \
		charts/nats-skeleton-nextjs

################################################################################
# Target: helm template
################################################################################
.PHONY: chart-dry-run
chart-dry-run:
	helm install \
		-n $(K8S_NAMESPACE) 
		-f $(VALUES_PATH) \
		--generate-name \
		--dry-run \
		--debug \
		--set vault-actions.bootstrapToken=$(VAULT_TOKEN) \
		charts/nats-skeleton-nextjs
