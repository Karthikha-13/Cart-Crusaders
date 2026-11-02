# Architecture Diagram

Cart Crusaders is a client-side grocery shopping app built with Expo and React Native for Android, iOS, and web. It uses React Context for application state and device-local storage; it does not currently have a backend service or a real payment gateway.

## Application Architecture

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
```mermaid
flowchart TD
    subgraph L1Client["Client"]
        L1Customer["Customer or Admin"]
        L1Router["Expo Router"]
        L1Screens["Shopping and Admin Screens"]
    end
    subgraph L1App["Application Layer"]
        L1Providers["React Context Providers"]
        L1Auth["Authentication State"]
        L1Catalog["Product Catalog State"]
        L1Cart["Cart State"]
        L1Orders["Order State"]
        L1Payments["Payment History State"]
    end
    subgraph L1Storage["Local Data"]
        L1Async[("AsyncStorage")]
    end
    subgraph L1Device["Device Services"]
        L1Location["Expo Location"]
        L1OSLocation["Device Location and Geocoding"]
    end
    subgraph L1Payment["Checkout"]
        L1PaymentMock["In-App Payment Simulation"]
    end

    L1Customer -->|"uses"| L1Router
    L1Router -->|"routes to"| L1Screens
    L1Screens -->|"reads and updates"| L1Providers
    L1Providers --> L1Auth
    L1Providers --> L1Catalog
    L1Providers --> L1Cart
    L1Providers --> L1Orders
    L1Providers --> L1Payments
    L1Auth -->|"session read and write"| L1Async
    L1Catalog -->|"catalog read and write"| L1Async
    L1Cart -->|"cart read and write"| L1Async
    L1Orders -->|"order read and write"| L1Async
    L1Payments -->|"transaction read and write"| L1Async
    L1Screens -->|"location request"| L1Location
    L1Location -->|"permission, GPS, reverse geocoding"| L1OSLocation
    L1Screens -->|"simulated payment result"| L1PaymentMock
    L1PaymentMock -->|"transaction history"| L1Payments

    classDef mono fill:#ffffff,stroke:#000000,color:#000000,stroke-width:1px
    class L1Customer,L1Router,L1Screens,L1Providers,L1Auth,L1Catalog,L1Cart,L1Orders,L1Payments,L1Location,L1OSLocation,L1PaymentMock mono
    class L1Async mono
    style L1Client fill:#ffffff,stroke:#000000,color:#000000
    style L1App fill:#ffffff,stroke:#000000,color:#000000
    style L1Storage fill:#ffffff,stroke:#000000,color:#000000
    style L1Device fill:#ffffff,stroke:#000000,color:#000000
    style L1Payment fill:#ffffff,stroke:#000000,color:#000000
    linkStyle default stroke:#000000,stroke-width:1px
```

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---:|---|
| Application framework | Expo SDK | ^58.0.22 | App runtime, native modules, and build tooling |
| User interface | React Native | 0.88.1 | Shared Android and iOS interface |
| Web rendering | React Native Web | ~0.21.0 | Web target for React Native screens |
| UI runtime | React | 19.3.0 | Components, hooks, and context state |
| Navigation | Expo Router | ~58.0.29 | File-based screens and navigation |
| State persistence | AsyncStorage | 2.2.0 | Device-local session, catalog, cart, order, and payment history |
| Device location | Expo Location | ~58.0.20 | Foreground location and reverse geocoding |
| Animation runtime | Reanimated and Worklets | ^4.7.1 / 0.13.0 | Native-capable animation support |

### Data Storage & External Services

AsyncStorage stores application data locally on the device; there is no remote database or application API in the current project. Expo Location requests foreground permission, reads device coordinates, and attempts reverse geocoding on native platforms. Checkout records an in-app simulated payment outcome in local payment history; the displayed UPI options do not connect to payment providers.

### Key Architectural Decisions

- Expo Router defines screens and navigation; React Context providers supply shared application state.
- The product catalog, cart, orders, login session, and payment history persist locally using AsyncStorage.
- Checkout and payment processing are demonstrations without a backend, payment processor, or server-side order fulfillment.

## Component Relationships

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
```mermaid
flowchart LR
    subgraph L2Presentation["Presentation"]
        cRoot["Root Layout"]
        cRouter["Expo Router"]
        cHome["Home and Explore Screens"]
        cCartScreen["Cart Screen"]
        cCheckout["Checkout Screen"]
        cOrdersScreen["Orders Screen"]
        cPaymentsScreen["Payments Screen"]
        cAdmin["Admin Screen"]
    end
    subgraph L2Business["Application State"]
        cAuth["Auth Context"]
        cCatalog["Product Catalog Context"]
        cCart["Cart Context"]
        cOrders["Order Context"]
        cPaymentHistory["Payment History Context"]
    end
    subgraph L2Persistence["Persistence"]
        cStorage[("AsyncStorage")]
    end

    cRoot -->|"configures"| cRouter
    cRoot -->|"provides shared state"| cAuth
    cRoot -->|"provides shared state"| cCatalog
    cRoot -->|"provides shared state"| cCart
    cRoot -->|"provides shared state"| cOrders
    cRoot -->|"provides shared state"| cPaymentHistory
    cRouter --> cHome
    cRouter --> cCartScreen
    cRouter --> cCheckout
    cRouter --> cOrdersScreen
    cRouter --> cPaymentsScreen
    cRouter --> cAdmin
    cHome -->|"browse products and add items"| cCatalog
    cHome -->|"update cart"| cCart
    cCartScreen -->|"change quantities"| cCart
    cCheckout -->|"read cart and place order"| cCart
    cCheckout -->|"create order"| cOrders
    cCheckout -->|"record simulated transaction"| cPaymentHistory
    cOrdersScreen -->|"read order history"| cOrders
    cPaymentsScreen -->|"read transaction history"| cPaymentHistory
    cAdmin -->|"add products"| cCatalog
    cAuth -->|"load and save session"| cStorage
    cCatalog -->|"load and save catalog"| cStorage
    cCart -->|"load and save cart"| cStorage
    cOrders -->|"load and save orders"| cStorage
    cPaymentHistory -->|"load and save transactions"| cStorage

    classDef mono fill:#ffffff,stroke:#000000,color:#000000,stroke-width:1px
    class cRoot,cRouter,cHome,cCartScreen,cCheckout,cOrdersScreen,cPaymentsScreen,cAdmin,cAuth,cCatalog,cCart,cOrders,cPaymentHistory mono
    class cStorage mono
    style L2Presentation fill:#ffffff,stroke:#000000,color:#000000
    style L2Business fill:#ffffff,stroke:#000000,color:#000000
    style L2Persistence fill:#ffffff,stroke:#000000,color:#000000
    linkStyle default stroke:#000000,stroke-width:1px
```

### Component Inventory

| Component | Layer | Type | Responsibility |
|---|---|---|---|
| Root Layout | Presentation | Expo Router layout | Loads fonts, configures navigation, and mounts shared providers |
| Home and Explore Screens | Presentation | Screens | Display and filter products; home can request device location |
| Cart Screen | Presentation | Screen | Displays cart contents and quantity controls |
| Checkout Screen | Presentation | Screen | Validates delivery details, simulates payment, and creates orders |
| Orders Screen | Presentation | Screen | Displays locally stored order history |
| Payments Screen | Presentation | Screen | Displays locally stored transaction history |
| Admin Screen | Presentation | Screen | Adds catalog products |
| Auth Context | Application State | React Context provider | Restores and updates the local user or admin session |
| Product Catalog Context | Application State | React Context provider | Seeds, restores, and updates product catalog state |
| Cart Context | Application State | React Context provider | Manages cart items, quantities, and totals |
| Order Context | Application State | React Context provider | Manages order history |
| Payment History Context | Application State | React Context provider | Manages simulated payment transactions |
| AsyncStorage | Persistence | Local key-value storage | Persists app state on the current device |
