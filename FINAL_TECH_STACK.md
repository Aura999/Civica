# FINAL TECH STACK

## Frontend

| Technology | Purpose | Why selected | Replaces | Must not be used for |
|---|---|---|---|---|
| React.js | UI rendering | Existing team familiarity and component model | Existing CRA runtime remains React | Server state cache, backend logic |
| Vite | Frontend build/dev tooling | Faster dev server and simpler modern build than CRA | Create React App / `react-scripts` | Backend bundling |
| JavaScript | Implementation language | Matches current code and 15-day delivery scope | N/A | Pretending to provide TypeScript guarantees |
| Tailwind CSS | Utility-first styling | Already used and fast for redesign | scattered custom CSS where avoidable | Business logic |
| React Router | Client routing | Existing router model, stable nested layouts | ad hoc route checks in components | Authorization data fetching |
| TanStack Query | Server state | Cache, refetch, mutation, invalidation for API data | Redux server state and many loading flags | Modal state, input state, sidebar state |
| React Context | Auth/session state only | Simple current-user/session provider | Redux auth/profile session coupling | General global store |
| React Hook Form | Form state | Efficient form handling and current partial adoption | ad hoc form state and Redux form-like state | Server caching |
| Zod | Frontend validation schemas | Co-locates validation with forms and can mirror backend schemas | manual validation | Database schema modeling |
| Axios | HTTP client | Existing use and interceptor support | scattered direct clients | State management |
| React Hot Toast | User feedback | Existing dependency, simple mutation feedback | inconsistent alerts | Error handling policy |
| Recharts | Useful analytics only | Simpler React charting for dashboards | Chart.js/react-chartjs-2 | Decorative charts without user value |

### State-specific frontend rules

- TanStack Query owns courses, categories, enrollments, progress, reviews, profile data, instructor analytics, admin analytics, and persisted AI conversation data.
- React Context owns only current user, auth status, session loading, login/logout functions, and role helpers.
- React Hook Form owns form field state.
- Local state owns modals, dropdowns, tabs, sidebars, upload previews, and local toggles.
- URL state owns search, filters, pagination, sort, course ID, and lesson ID.

## Backend

| Technology | Purpose | Why selected | Replaces | Must not be used for |
|---|---|---|---|---|
| Node.js | Runtime | Existing backend runtime | N/A | CPU-heavy offline processing |
| Express.js | HTTP API | Existing stack and sufficient for modular monolith | ad hoc route organization | Microservice framework |
| MongoDB | Primary database | Existing database and document fit for courses | N/A | Relational reporting engine |
| Mongoose | ODM | Existing models and migration safety | raw Mongo calls in app logic | Business rules in hooks |
| JWT | Stateless auth token | Existing auth strategy | N/A | Storing sensitive data in token |
| bcrypt | Password hashing | Existing secure password hashing approach | plaintext or weak hashes | Token hashing |
| Zod | Backend validation | Same schema language as frontend, good JS ergonomics, enough for this scope | manual controller validation | Persistence model definition |
| Multer | Multipart upload handling | Standard Express upload middleware | express-fileupload | Long-term file storage |
| Cloudinary | Media storage | Existing integration for images/videos/resources | local file storage | Authorization decisions |
| Nodemailer | Email sending | Simple, interview-explainable SMTP abstraction | current Resend/legacy ambiguity | Job queue by itself |
| Helmet | Security headers | Low-cost Express hardening | missing default headers | Authorization |
| Express Rate Limit | Abuse protection | Simple route-level throttling | no throttling | Business quota logic |
| CORS | Controlled cross-origin access | Existing need for frontend/backend split | `origin: "*"` | Authentication |
| Compression | Response compression | Simple performance improvement | uncompressed API payloads | Media optimization |
| Morgan | HTTP request logging | Simpler than Winston for this scope; enough request visibility | scattered console request logs | Structured audit/event logging at enterprise scale |

## AI and RAG

| Technology | Purpose | Why selected |
|---|---|---|
| OpenAI API | Chat completion and embeddings | Reliable managed LLM API; avoids model hosting complexity |
| LangChain.js | RAG orchestration | Practical loaders/splitters/retriever composition in JS |
| OpenAI embeddings | Vector representation | Consistent with OpenAI generation and simple integration |
| MongoDB Atlas Vector Search | Vector storage/retrieval | Reuses existing MongoDB Atlas, avoids separate vector database, keeps course/resource metadata beside app data |
| PDF text extraction | Resource ingestion | Required for instructor-uploaded PDFs |
| Recursive text splitting | Chunk quality | Handles long documents with coherent chunks |
| Course-scoped vector retrieval | Authorization and relevance | Prevents cross-course leakage and generic answers |
| Source-grounded responses | Trust | Returns answer tied to approved course resources |

MongoDB Atlas Vector Search is preferred over a separate vector database because CIVICA already uses MongoDB Atlas, the expected document volume is moderate, deployment stays simpler, metadata filters such as `courseId` are native, and the architecture remains explainable for a 15-day resume-ready build.

## Testing

| Tool | Purpose |
|---|---|
| Vitest | Frontend/unit tests in Vite |
| React Testing Library | Component behavior tests |
| Supertest | Backend route tests |
| MongoDB Memory Server | Isolated backend model/service tests |
| Playwright | Small number of end-to-end flows |

## Documentation and deployment

| Tool/platform | Purpose |
|---|---|
| Swagger/OpenAPI | API contract |
| Postman | Manual API verification collection |
| GitHub Actions | CI checks |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Managed database and vector search |
| Cloudinary | Managed media storage |

## Technologies deliberately not used

| Technology | Reason |
|---|---|
| Redux | Overkill for target state model; server state belongs in TanStack Query and auth belongs in context. |
| Microservices | Adds deployment and data consistency complexity without product need. |
| Kubernetes | Unnecessary for a single MERN modular monolith portfolio project. |
| Kafka | No event-streaming requirement in the 15-day scope. |
| GraphQL | REST is simpler and adequate for course/enrollment/admin APIs. |
| Socket.IO | No real-time requirement unless future chat/notifications emerge. |
| Separate vector database | MongoDB Atlas Vector Search is sufficient and simpler. |
| Multi-agent architecture | A course-specific RAG assistant is enough; multi-agent systems add avoidable complexity. |
| Docker orchestration | Not required for Vercel/Render/MongoDB Atlas/Cloudinary target deployment. |
