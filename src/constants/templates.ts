import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'flowchart-basic',
    name: 'Basic Flowchart',
    type: 'flowchart',
    category: 'Flowchart',
    description: 'A simple flowchart example',
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,
  },
  {
    id: 'flowchart-complex',
    name: 'Complex Flowchart',
    type: 'flowchart',
    category: 'Flowchart',
    description: 'A more detailed flowchart with subprocesses',
    code: `flowchart TB
    A[Start] --> B[Initialize System]
    B --> C{Check Config}
    C -->|Valid| D[Load Modules]
    C -->|Invalid| E[Show Error]
    D --> F{All Loaded?}
    F -->|Yes| G[Start Service]
    F -->|No| H[Retry Loading]
    H --> D
    G --> I[Monitor]
    I --> J{Health Check}
    J -->|OK| I
    J -->|Failed| K[Alert]
    K --> L[Restart]
    L --> B
    E --> M[End]`,
  },
  {
    id: 'sequence-basic',
    name: 'Basic Sequence Diagram',
    type: 'sequence',
    category: 'Sequence',
    description: 'Simple user authentication flow',
    code: `sequenceDiagram
    participant U as User
    participant A as App
    participant S as Server

    U->>A: Enter credentials
    A->>S: Login request
    S->>S: Validate
    S-->>A: Token
    A-->>U: Success message`,
  },
  {
    id: 'sequence-complex',
    name: 'Complex Sequence Diagram',
    type: 'sequence',
    category: 'Sequence',
    description: 'E-commerce checkout process',
    code: `sequenceDiagram
    actor Customer
    participant Cart
    participant Payment
    participant Inventory
    participant Email

    Customer->>Cart: Add items
    Customer->>Cart: Checkout
    Cart->>Payment: Process payment
    Payment->>Payment: Validate card

    alt Payment successful
        Payment-->>Cart: Payment confirmed
        Cart->>Inventory: Reserve items
        Inventory-->>Cart: Reserved
        Cart->>Email: Send confirmation
        Email-->>Customer: Order confirmed
    else Payment failed
        Payment-->>Cart: Payment declined
        Cart-->>Customer: Show error
    end`,
  },
  {
    id: 'class-basic',
    name: 'Basic Class Diagram',
    type: 'class',
    category: 'Class',
    description: 'Simple class structure',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }

    class Dog {
        +String breed
        +bark()
    }

    class Cat {
        +String color
        +meow()
    }

    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    id: 'state-basic',
    name: 'Basic State Diagram',
    type: 'state',
    category: 'State',
    description: 'Document workflow states',
    code: `stateDiagram-v2
    [*] --> Draft
    Draft --> Review: Submit
    Review --> Approved: Accept
    Review --> Draft: Reject
    Approved --> Published: Publish
    Published --> Archived: Archive
    Archived --> [*]`,
  },
  {
    id: 'er-basic',
    name: 'Basic ER Diagram',
    type: 'er',
    category: 'ER',
    description: 'Simple database schema',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        string address
    }
    ORDER {
        int orderNumber
        date orderDate
        string status
    }
    LINE-ITEM {
        string productCode
        int quantity
        float price
    }`,
  },
  {
    id: 'gantt-basic',
    name: 'Basic Gantt Chart',
    type: 'gantt',
    category: 'Gantt',
    description: 'Project timeline',
    code: `gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements    :a1, 2024-01-01, 30d
    Design         :a2, after a1, 20d
    section Development
    Backend        :a3, after a2, 45d
    Frontend       :a4, after a2, 50d
    section Testing
    Integration    :a5, after a3, 15d
    User Testing   :a6, after a4, 10d
    section Deployment
    Deploy         :a7, after a5, 5d`,
  },
  {
    id: 'pie-basic',
    name: 'Basic Pie Chart',
    type: 'pie',
    category: 'Pie',
    description: 'Market share distribution',
    code: `pie title Market Share
    "Product A" : 45
    "Product B" : 30
    "Product C" : 15
    "Others" : 10`,
  },
  {
    id: 'journey-basic',
    name: 'User Journey',
    type: 'journey',
    category: 'Journey',
    description: 'Customer experience journey',
    code: `journey
    title Customer Journey - Online Shopping
    section Discovery
      Search for product: 5: Customer
      View product details: 4: Customer
      Read reviews: 3: Customer
    section Purchase
      Add to cart: 5: Customer
      Enter payment info: 3: Customer
      Complete order: 5: Customer
    section Post-Purchase
      Receive confirmation: 5: Customer
      Track delivery: 4: Customer
      Receive product: 5: Customer`,
  },
  {
    id: 'git-basic',
    name: 'Git Graph',
    type: 'git',
    category: 'Git',
    description: 'Git branching workflow',
    code: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop`,
  },
];

export const getTemplatesByCategory = () => {
  const categories = new Map<string, Template[]>();

  TEMPLATES.forEach((template) => {
    const existing = categories.get(template.category) || [];
    categories.set(template.category, [...existing, template]);
  });

  return categories;
};
