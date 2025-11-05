1. Core — autenticación y usuarios

- Registro / login (email+pass).
- Login social (OAuth: Google, GitHub, Apple).
- Verificación de email.
- Recuperación de contraseña.
- Perfil de usuario (nombre, bio, ubicación, webs).
- Avatares y fotos de perfil.
- Preferencias / settings (privacidad, notifs).
- Roles y permisos (user, moderator, admin, superadmin).
- MFA / 2FA (TOTP / SMS).
- Bloqueos y listas negras (block / mute).
- Borrado de cuenta / exportar datos (GDPR-ish).

2. Feed y Social Graph

- Modelo de relaciones (amistad, follow/unfollow, suscripción).
- Feed cronológico y/o algorítmico.
- Timeline/Perfil (posts propios).
- Prioridad y ranking (peso, engagement, decay).
- Hashtags / topics.
- Seguimiento de contenidos y usuarios.
- Sugerencias de personas/hashtags.
- Discover / explorar.

3. Publicaciones (posts)

- Texto, enlaces, imágenes, videos, audio.
- Publicaciones largas vs micro-posts.
- Edición y borrado de posts.
- Reacciones (me gusta, love, dislike, emoji pots).
- Compartir / re-post / retweet.
- Pins (anclar).
- Drafts / guardado automático.
- Vista previa de enlaces (meta tags, oembed).
- Publicaciones programadas.

4. Comentarios

- Hilos (threaded comments).
- Moderación en línea (editar, eliminar).
- Reacciones a comentarios.
- Paginación / lazy load.
- Notificaciones por respuesta.
- 5. Mensajería / Chat
- Mensajes directos (DMs).
- Chats grupales.
- Estado de lectura / typing indicators.
- Envío de archivos / imágenes.
- Encriptación en tránsito (TLS) y opcional E2E.
- Búsqueda en chats.
- Limitación / rate limiting / anti-spam.
- Archivo / eliminación de conversaciones.

6. Media & Storage

- Uploads de imágenes y vídeos.
- Storage S3-compatible (Minio) + CDN para servir (si hay).
- Transcodificación de video (opcional).
- Thumbnails, optimización y compresión.
- Límite por usuario/quota.
- Prevención de virus/scan.
- Integración con moderación automática (ML).

7. Moderación y seguridad

- Panel de moderadores (queue de reportes).
- Triage de contenido reportado (aceptar/rechazar).
- Sistemas de warning / strikes y suspensión temporal/permanente.
- Moderación automática (hash lookup, ML classifiers, similarity).
- Detección de spam (rate limits, heuristics).
- Lista gris / bloqueo por IP.
- Herramientas para conservar evidencias (logs, export).
- Auditoría de acciones de mods (quién hizo qué).
- Policies por región / etiquetas de contenido sensible (NSFW, política, etc.).

8. Administración / Operaciones

- Panel de administración (users, roles, billing).
- Gestión de flags y feature toggles (feature flags).
- Control de cuotas / límites.
- Gestión de backups (DB + storage).
- Monitoreo y alertas (Prometheus / Grafana / Sentry).
- Migraciones DB / versionado.
- Multi-tenant (si aplica).
- Health checks / status page.

9. Notificaciones

- Notificaciones push (web push / mobile push).
- Notificaciones por email (templates, colas).
- In-app notifications (real-time via WebSocket/Server-Sent Events).
- Preferencias de notificación por usuario.
- Digest emails (daily/weekly).

10. Búsqueda e indexación

- Búsqueda de usuarios/posts (fuzzy).
- Indexación (Elasticsearch / Meilisearch / Postgres full-text).
- Filtrado, ordenamiento y facetas.

11. Recomendación y personalización

- Recommender system (CF, content-based, hybrid).
- Modelos básicos: popularity, recency, collaborative filtering.
- Feature pipeline para señales (likes, follows, views).
- A/B testing para ranking.
- Cold start strategies.

12. Tiempo real

- Websockets / SSE para feed en vivo, chats, notifs.
- Pub/Sub (Redis, NATS, Kafka).
- Presence / presence lists (online users).

13. Jobs / Background

- Queue system (BullMQ / Bull / RabbitMQ / Sidekiq).
- Workers para envío de mail, procesado de imágenes, thumbnails, ML tasks.
- Cron / scheduled jobs (agenda, cron, temporal).
- Retries, DLQs.

14. Analytics / metrics

- Evento de tracking (post view, click, signup).
- Dashboards (DAU/MAU, retención, funnel).
- Funnels de conversión (registro, verificación, postear).
- Export de datos / SQL / BI.
- Audiencias y cohortes.

15. Monetización / Ads

- Sistema de anuncios (creación, targeting, reporting).
- Billing / facturación (Stripe integration).
- Premium features / suscripciones.
- Moderación de anuncios.

16. SEO / Social previews

- Meta tags (OpenGraph, Twitter cards) por URL.
- SSR/SSG para páginas públicas (mejor SEO).
- Sitemap, robots.txt, canonical tags.
- Microdata / structured data.

17. Integraciones / APIs

- API pública / privada (REST / GraphQL).
- Rate limiting, API keys / OAuth2.
- Webhooks (subscribir a eventos).
- Integraciones 3rd-party (analytics, SSO).

18. Privacy & Legal / Compliance

- Logs y retención (p. ej. 30/90/365 días).
- Herramientas de cumplimiento (GDPR: erasure, data export).
- Consentimiento de cookies y tracking.
- Terms & policies management.

19. Internacionalización / localización

- i18n strings, formatos de fechas, RTL support.
- Zona horaria por usuario.

20. UI / UX / Theming

- Temas (light/dark), color variables y branding.
- Logo / nombre / favicon editable por proyecto.
- Plantillas y layouts configurables.
- Accessibility (a11y).

21. Testing / QA

- Unit tests, E2E (Playwright / Cypress).
- Mock servers / fixtures.
- Load testing / simple stress scripts.

22. Dev Tools / CI

- Scripts de scaffolding (create app).
- Seeders / fixtures para datos.
- Local dev proxy configuración (.env, hosts).
- Live reload / hot module replacement.

23. Infraestructura / infra-as-code

- Docker / docker-compose, Kubernetes manifests.
- Terraform / Pulumi para infra.
- Private registry / image caching.
- Reverse proxy / SSL termination (NGINX).
- Local CDN/cache (caddy/nginx).

24. Observabilidad & Seguridad avanzada

- Tracing (OpenTelemetry).
- Rate limiting & WAF.
- Secrets management.
- Vulnerability scanning (images).

25. IA / ML

- Content classification (toxic, hate, spam, NSFW).
- Image recognition (CE/IP detection).
- Captioning / auto-tags.
- Summarization / auto-moderation suggestions.
- Recommendation models (embeddings).
- Feature: "suggest caption", "auto-hashtags".

26. Extras / Especializados

- Geo features (check-ins, location feed)
- Events / calendar / RSVPs.
- Marketplace / buy-sell.
- Groups / communities / sub-forums.
- Reactions avanzadas, badges, gamification.
- Export/import OMNI (activitypub / Mastodon compatibility).
