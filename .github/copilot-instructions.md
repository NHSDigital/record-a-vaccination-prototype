When using components from the NHS.UK Frontend library, prefer the Nunjucks version over HTML.

When adding or changing validation errors:

- Keep validation logic, branching, and error codes in route files.
- Do not add user-facing validation copy in route `.js` files unless there is no template surface to own it.
- In templates, map route-provided error codes to the final user-facing error text.
- Templates should render both the field-level `errorMessage` and the matching `errorSummary` entry from the same template-owned message.
- Prefer stable error codes such as `required`, `invalid`, `invalid-format`, `too-many`, `not-found` rather than passing full prose from the route.
- Routes may pass `href`, field ids, and structured error objects, but the final wording should live in the `.html`/`.njk` template.
- When following this pattern in Nunjucks, avoid generic local variable names like `errorMessage`; use page-specific names such as `workTypeErrorMessage` to avoid collisions with component options.
- When modifying a form flow, preserve this route-code/template-copy split and do not introduce new route-owned validation strings.
