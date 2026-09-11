# Product analytics deployment

This is the verified static distribution from Tarasca-DAO/mythicalSDK PR 28. The manifest records all vendor hashes. The bootstrap sends only the closed event vocabulary through the durable collector after consent. No PostHog vendor is loaded before consent; replay remains disabled. Cloudflare is injected at the edge on the current public host; do not add another beacon here.

To disable, remove the bootstrap script from every HTML entry (including submit/index.html where present) and publish. Existing products continue to work. The public ingestion keys are not personal read/admin credentials. No third-party forms, wallet values or operation responses may be passed to the event bridge. Hostnames outside the contract do not initialize analytics; localhost uses the technical-test population.
