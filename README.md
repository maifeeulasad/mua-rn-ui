# mua-rn-ui

A comprehensive React Native UI library with 64+ components, featuring a modern theme system and TypeScript support.

## 🚀 Features

- **64+ Components** across 5 categories
- **Full Theme Support** with Light, Dark, and Aesthetic variants
- **TypeScript** first with complete type definitions
- **Customizable** styling and behavior
- **Production Ready** with comprehensive testing

## 📦 Installation

```bash
npm install mua-rn-ui
```

## 🎨 Theme System

All components support automatic theming with three built-in variants:

```typescript
import { ThemeProvider } from 'mua-rn-ui';

const App = () => {
  return (
    <ThemeProvider theme="light"> {/* "light" | "dark" | "aesthetic" */}
      {/* Your app components */}
    </ThemeProvider>
  );
};
```

## 📚 Components

### 🏷️ DataDisplay (9 components)

Components for displaying data and information.

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **Badge** | Notification badges and counters | `count`, `dot`, `color`, `size` |
| **Card** | Content containers with elevation | `title`, `children`, `shadow`, `padding` |
| **Carousel** | Image and content carousel with dots | `data`, `autoPlay`, `showDots`, `interval` |
| **Grid** | Responsive grid layout | `columns`, `data`, `renderItem`, `spacing` |
| **Icon** | Icon display with multiple families | `name`, `family`, `size`, `color` |
| **List** | Structured list container | `data`, `renderItem`, `header`, `footer` |
| **NoticeBar** | Announcement and alert bars | `type`, `text`, `closable`, `scrollable` |
| **Steps** | Step-by-step progress indicator | `steps`, `current`, `direction`, `status` |
| **Tag** | Labels and categorization tags | `color`, `closable`, `selected`, `small` |

#### Badge Examples
```typescript
<Badge count={5} />
<Badge dot color="red" />
<Badge count={99} size="large" />
```

#### Card Examples  
```typescript
<Card title="Card Title">
  <Text>Card content here</Text>
</Card>
```

#### Carousel Examples
```typescript
<Carousel
  data={images}
  autoPlay={true}
  interval={3000}
  showDots={true}
/>
```

### 📝 DataEntry (13 components)

Components for user input and data collection.

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **Button** | Pressable button with variants | `title`, `variant`, `size`, `disabled`, `loading` |
| **Checkbox** | Multi-select checkbox input | `checked`, `label`, `disabled`, `indeterminate` |
| **DatePicker** | Date selection interface | `value`, `mode`, `format`, `minDate`, `maxDate` |
| **DatePickerView** | Inline date picker view | `value`, `mode`, `onChange`, `locale` |
| **Form** | Form container with validation | `children`, `onSubmit`, `validation` |
| **ImagePicker** | Image selection and capture | `multiple`, `quality`, `allowsEditing` |
| **Input** | Text input with validation | `value`, `placeholder`, `type`, `validation` |
| **Picker** | Dropdown selection picker | `data`, `selectedValue`, `onValueChange` |
| **Radio** | Single-select radio input | `selected`, `label`, `value`, `group` |
| **SearchBar** | Search input with suggestions | `value`, `placeholder`, `onSearch`, `showCancel` |
| **Slider** | Range slider input | `value`, `min`, `max`, `step`, `disabled` |
| **Stepper** | Numeric stepper input | `value`, `min`, `max`, `step`, `disabled` |
| **Switch** | Toggle switch input | `value`, `disabled`, `size`, `color` |

#### Button Examples
```typescript
<Button title="Primary" variant="primary" />
<Button title="Loading" loading={true} />
<Button title="Large" size="large" />
```

#### Input Examples
```typescript
<Input 
  placeholder="Enter text"
  type="email"
  validation={{ required: true }}
/>
```

#### Checkbox Examples
```typescript
<Checkbox 
  label="Accept terms"
  checked={accepted}
  onChange={setAccepted}
/>
```

### 🧭 Navigation (5 components)

Components for navigation and user guidance.

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **Drawer** | Side navigation drawer | `visible`, `position`, `width`, `overlay` |
| **Pagination** | Page navigation controls | `current`, `total`, `pageSize`, `showSizeChanger` |
| **TabBar** | Bottom tab navigation | `tabs`, `activeTab`, `onTabPress`, `variant` |
| **Tabs** | Horizontal tab navigation | `tabs`, `activeTab`, `onTabChange`, `scrollable` |
| **Tooltip** | Contextual help tooltips | `content`, `position`, `trigger`, `visible` |

#### TabBar Examples
```typescript
<TabBar
  tabs={[
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'profile', title: 'Profile', icon: 'user' }
  ]}
  activeTab="home"
  onTabPress={setActiveTab}
/>
```

#### Pagination Examples
```typescript
<Pagination
  current={1}
  total={100}
  pageSize={10}
  onChange={setPage}
/>
```

### 💬 Feedback (3 components)

Components for user feedback and notifications.

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **Modal** | Modal dialogs and overlays | `visible`, `title`, `footer`, `closable` |
| **Progress** | Progress indicators | `percent`, `type`, `status`, `showInfo` |
| **Toast** | Temporary notification messages | `message`, `type`, `duration`, `position` |

#### Modal Examples
```typescript
<Modal
  visible={showModal}
  title="Confirm Action"
  onClose={() => setShowModal(false)}
>
  <Text>Are you sure?</Text>
</Modal>
```

#### Progress Examples
```typescript
<Progress percent={75} type="line" />
<Progress percent={50} type="circle" />
```

### 📐 Layout (4 components)

Components for layout and spacing.

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **Flex** | Flexible layout container | `direction`, `justify`, `align`, `wrap`, `gap` |
| **View** | Enhanced view with theme support | `padding`, `margin`, `backgroundColor` |
| **WhiteSpace** | Spacing component | `size`, `direction` |
| **WingBlank** | Horizontal margin spacing | `size` |

#### Flex Examples
```typescript
<Flex direction="row" justify="space-between" align="center">
  <Text>Left</Text>
  <Text>Right</Text>
</Flex>

<Flex padding="md" backgroundColor="surface" borderRadius="lg">
  <Text>Themed container</Text>
</Flex>
```

## 🎨 Theme Customization

### Available Themes

| Theme | Description | Use Case |
|-------|-------------|----------|
| `light` | Clean light theme | Default, professional apps |
| `dark` | Modern dark theme | Night mode, OLED displays |
| `aesthetic` | Vibrant aesthetic theme | Creative, colorful apps |

### Theme Properties

| Property | Description | Values |
|----------|-------------|--------|
| **Colors** | Color palette | `primary`, `secondary`, `success`, `error`, `warning` |
| **Spacing** | Consistent spacing | `xs`, `sm`, `md`, `lg`, `xl`, `xxl` |
| **Typography** | Font styles | `fontSize`, `fontWeight`, `lineHeight` |
| **BorderRadius** | Border radius values | `none`, `sm`, `md`, `lg`, `xl`, `full` |

### Custom Theme Example

```typescript
import { createTheme, ThemeProvider } from 'mua-rn-ui';

const customTheme = createTheme({
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    // ... other colors
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    // ... other spacing
  }
});

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

## 🔧 Advanced Usage

### Form Validation Example

```typescript
import { Form, Input, Button, Checkbox } from 'mua-rn-ui';

const SignupForm = () => {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        validation={{ required: true, email: true }}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        validation={{ required: true, minLength: 8 }}
      />
      <Checkbox
        name="terms"
        label="I accept the terms"
        validation={{ required: true }}
      />
      <Button title="Sign Up" type="submit" />
    </Form>
  );
};
```

### Navigation Setup Example

```typescript
import { TabBar, Drawer } from 'mua-rn-ui';

const AppNavigation = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  return (
    <>
      <TabBar
        tabs={[
          { key: 'home', title: 'Home', icon: 'home' },
          { key: 'search', title: 'Search', icon: 'search' },
          { key: 'profile', title: 'Profile', icon: 'user' }
        ]}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      
      <Drawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        position="left"
      >
        {/* Drawer content */}
      </Drawer>
    </>
  );
};
```

## 📱 Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| **iOS** | ✅ Full | iOS 11+ |
| **Android** | ✅ Full | Android 6+ (API 23+) |
| **Web** | ⚠️ Partial | Basic components only |

## 🛠️ CI Build with pnpm

Use GitHub Actions to verify apps that depend on this library build on both the latest Node.js release and an LTS version while keeping pnpm in sync:

```yaml
name: Build with pnpm

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/maifeeulasad/mua-rn-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/maifeeulasad/mua-rn-ui/discussions)
- **Email**: support@mua-rn-ui.com
