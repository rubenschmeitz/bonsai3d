# Business preparation

The public site is an interest-testing catalogue (`status: "interest"`). It accepts no
orders, reservations or payments. The configured public email is available for
questions and sharing saved selections. Do not present
local downloads as submitted enquiries, orders or withdrawal notifications.

Public copy explains the current interest-only state once on the service page.
Do not repeat that explanation in global banners, footers, product cards or
selection notices. Local exports describe saved choices and state that they
have not been submitted; they do not create orders or reservations.

`assets/business-config.json` is the single place for future **public** seller
information. Its empty fields are deliberate: legal structure, contact details,
registration, VAT treatment, delivery and payment have not been confirmed.
Never add account passwords, tokens, bank details, private notes or customer
records to this public repository. Leave unknown information empty.

The application currently permits `status: "interest"` and the legacy
`status: "preparation"`, with online
ordering and online payments disabled. Changing these values is not a launch
switch: the app deliberately refuses an unsupported sales mode. A future launch
requires its own implementation and review of the actual selling process.

Before sales start, confirm and publish the appropriate seller identity,
business/contact and return addresses, email, phone, registration and applicable
VAT information. Agree consumer prices, shipping, lead times, payment, standard
product withdrawal rights, genuine custom-work exceptions and statutory remedies.
Complete privacy information for the actual email, quote/order handling,
retention and service providers. Do not infer a VAT scheme or business status.

If contracts can be concluded through the website, implement the required online
withdrawal facility with receipt/confirmation. A local text download or `mailto`
link alone is not a functioning automatically acknowledged withdrawal service.
The current local-only site does not claim to provide one.

Keep generated concepts separate from stock and made objects. A rendered tree
or display does not prove printability, material properties or availability.

Validation: `npm run check` and `npm test`. The browser smoke test exercises
service/privacy pages, local draft export, optional contact fields, stale draft
invalidation, and removal of current/legacy BONSAI3D preferences. It uses
synthetic data and sends no messages or orders.

Rules checked on 14 October 2026:

- [ACM: information before and after purchase](https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/verplichte-informatie-voor-en-na-de-koop)
- [ACM: withdrawal rights](https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd)
- [ACM: online withdrawal facility](https://www.acm.nl/nl/publicaties/acm-roept-online-retailers-op-zich-voor-te-bereiden-op-herroepingsknop)
- [AP: right to information](https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-informatie)

Preparation is not business registration or a legal-compliance certification.

Cart refinement: per-object preferences and dimensions are saved locally with the
cart, while name/email and the overall request text are not persisted. Prices
are recomputed from current catalogue/estimate inputs. Design work is a one-off
fee per configuration; quote-only versions are excluded from the known subtotal.
Delivery is undecided and no full payable total or payment is implied.

## Interest-testing phase and future ordering

The current public flow is **My interests**, not a shopping cart. It saves the
existing structured product/configuration model locally (including quantities,
colour, dimensions and guide prices). Feedback, interest level and suggested
price are only included in a locally copied/downloaded text draft; they are not
persisted or transmitted. Contact and delivery fields are disabled and hidden.
No Marktplaats listing URL has been supplied; no direct listing link or posting
is invented. Visitors can share their saved overview through their own email app.
The site has no feedback dashboard, customer account, order ID or reservation.

Product data, price functions and configuration storage are retained to avoid
rebuilding them when sales are authorized. Future ordering is **not implemented**
and cannot be activated by changing one JSON flag. Implement and validate a
server-side order/price/stock workflow, seller details, shipping/tax calculation,
consumer information, confirmation and privacy handling before accepting orders.
Integrate a suitable hosted payment provider if online payment is desired; never
put secret credentials or customer records on GitHub Pages. Use the retained
product/configuration schema for an order draft, but recompute and validate prices
on the server. Review actual stock/manufacturing before promising fulfilment.
Existing interests must never become orders automatically when the mode changes.

Calling the site an interest survey does not determine business-registration or
tax status. No claim of a legal exemption is made by the site.
