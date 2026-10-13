# Business preparation

The public site is an enquiry-draft catalogue in preparation. It accepts no
orders or payments and has no configured public contact email. Do not present
local downloads as submitted enquiries, orders or withdrawal notifications.

`assets/business-config.json` is the single place for future **public** seller
information. Its empty fields are deliberate: legal structure, contact details,
registration, VAT treatment, delivery and payment have not been confirmed.
Never add account passwords, tokens, bank details, private notes or customer
records to this public repository. Leave unknown information empty.

The application currently permits only `status: "preparation"`, with online
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
