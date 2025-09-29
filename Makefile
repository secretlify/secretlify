.PHONY: backend frontend dev help clean install

# Default target
help:
	@echo "Available commands:"
	@echo "  backend    - Run backend development server"
	@echo "  frontend   - Run frontend development server"
	@echo "  dev        - Run both backend and frontend concurrently"
	@echo "  install    - Install dependencies for both backend and frontend"
	@echo "  clean      - Clean node_modules and build artifacts"
	@echo "  help       - Show this help message"

# Run backend development server
backend:
	@echo "Starting backend development server..."
	cd backend && npm run start:dev

# Run frontend development server  
frontend:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

# Run both backend and frontend concurrently
dev:
	@echo "Starting both backend and frontend..."
	@trap 'kill %1; kill %2' EXIT; \
	make backend & make frontend & \
	wait

# Install dependencies for both projects
install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && pnpm install

# Clean build artifacts and node_modules
clean:
	@echo "Cleaning backend..."
	cd backend && rm -rf node_modules dist
	@echo "Cleaning frontend..."
	cd frontend && rm -rf node_modules dist
