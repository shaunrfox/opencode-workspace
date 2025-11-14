# Panda CSS Form Architecture

## When to Use This Skill

Use this skill when:
- Building composable form components using atomic design principles
- Creating accessible form elements with proper ARIA attributes
- Designing reusable form patterns (inputs, checkboxes, radios)
- Implementing form validation UI
- Integrating with form libraries (React Hook Form, Formik)

## Three-Layer Architecture

Build forms using atomic design principles:

### Layer 1: Atomic Components

Individual styled form controls - single responsibility (one HTML element).

**Examples**: TextInput, CheckBox, Radio, Select

```typescript
// src/components/TextInput/TextInput.tsx
import { type FC, type InputHTMLAttributes } from 'react'
import { input, type InputVariantProps } from '@styled-system/recipes'
import { Box } from '../Box/Box'

export type TextInputProps =
  InputHTMLAttributes<HTMLInputElement> &
  InputVariantProps &
  {
    error?: boolean
  }

export const TextInput: FC<TextInputProps> = ({
  size,
  error,
  ...props
}) => {
  return (
    <Box
      as="input"
      className={input({ size })}
      data-error={error || undefined}
      aria-invalid={error}
      {...props}
    />
  )
}
```

**Characteristics**:
- Accept all HTML attributes for their element type
- Accept Panda CSS style props via Box
- Support variant props from recipes
- Minimal business logic
- Fully styled and accessible

### Layer 2: Molecular Components

Simple compositions combining 2-3 atomic elements.

**Examples**: CheckboxInput (checkbox + label), RadioInput (radio + label)

```typescript
// src/components/CheckboxInput/CheckboxInput.tsx
import { type FC, type InputHTMLAttributes } from 'react'
import { CheckBox } from '../CheckBox/CheckBox'

export type CheckboxInputProps =
  InputHTMLAttributes<HTMLInputElement> &
  {
    label: string
    helperText?: string
    error?: boolean
  }

export const CheckboxInput: FC<CheckboxInputProps> = ({
  label,
  helperText,
  error,
  ...props
}) => {
  return (
    <Box display="flex" flexDirection="column" gap="4">
      <CheckBox
        label={label}
        error={error}
        {...props}
      />
      {helperText && (
        <Box
          as="span"
          fontSize="sm"
          color={error ? 'error' : 'text.secondary'}
          pl="28"  // Align with label
        >
          {helperText}
        </Box>
      )}
    </Box>
  )
}
```

**Why**: Improves ergonomics (less boilerplate for consumers).

### Layer 3: Organism Components

Complex wrappers that provide consistent patterns.

**Example**: FormField - wraps any input with label, help text, and error message

```typescript
// src/components/FormField/FormField.tsx
import { type FC, type ReactElement, cloneElement, useId } from 'react'
import { Box } from '../Box/Box'

export type FormFieldProps = {
  label: string
  helperText?: string
  errorText?: string
  required?: boolean
  children: ReactElement  // Input component
}

export const FormField: FC<FormFieldProps> = ({
  label,
  helperText,
  errorText,
  required,
  children
}) => {
  const id = useId()
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorText ? `${id}-error` : undefined

  // Build aria-describedby from helper and error IDs
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  // Clone child input and inject IDs + ARIA attributes
  const enhancedChild = cloneElement(children, {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': errorText ? true : undefined,
    error: errorText ? true : undefined
  })

  return (
    <Box display="flex" flexDirection="column" gap="8">
      {/* Label */}
      <Box
        as="label"
        htmlFor={id}
        fontSize="sm"
        fontWeight="medium"
        color="text.primary"
      >
        {label}
        {required && (
          <Box as="span" color="error" ml="4">*</Box>
        )}
      </Box>

      {/* Input (with injected props) */}
      {enhancedChild}

      {/* Helper text */}
      {helperText && !errorText && (
        <Box
          id={helperId}
          fontSize="sm"
          color="text.secondary"
        >
          {helperText}
        </Box>
      )}

      {/* Error message */}
      {errorText && (
        <Box
          id={errorId}
          fontSize="sm"
          color="error"
        >
          {errorText}
        </Box>
      )}
    </Box>
  )
}
```

**Key Features**:
- Generates unique IDs for label/input association
- Injects `aria-describedby` linking help text and errors
- Sets `aria-invalid` on errors
- Consistent layout and spacing
- Reduces boilerplate in forms

**Usage**:
```typescript
<FormField
  label="Email"
  helperText="We'll never share your email"
  errorText={errors.email?.message}
  required
>
  <TextInput
    type="email"
    placeholder="you@example.com"
  />
</FormField>
```

## Recipe Organization

Mirror the component hierarchy:

```typescript
// Atomic components get individual recipes
recipes: {
  input: defineRecipe({ /* ... */ }),
  select: defineRecipe({ /* ... */ })
}

// Molecular components use slot recipes
slotRecipes: {
  checkboxInput: defineSlotRecipe({
    slots: ['container', 'checkbox', 'helper']
  })
}

// Organism components compose existing recipes
// FormField doesn't need its own recipe
```

## Form Validation Integration

### React Hook Form

```typescript
import { useForm } from 'react-hook-form'

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        errorText={errors.email?.message}
        required
      >
        <TextInput
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
        />
      </FormField>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Formik

```typescript
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required')
})

function MyForm() {
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={schema}
      onSubmit={(values) => console.log(values)}
    >
      {({ errors, touched }) => (
        <Form>
          <Field name="email">
            {({ field }) => (
              <FormField
                label="Email"
                errorText={touched.email && errors.email}
                required
              >
                <TextInput {...field} type="email" />
              </FormField>
            )}
          </Field>

          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  )
}
```

## Accessibility Best Practices

### Always Include:

1. **Unique IDs** for label/input association
   ```typescript
   <label htmlFor={id}>{label}</label>
   <input id={id} />
   ```

2. **aria-describedby** for help text and errors
   ```typescript
   <input aria-describedby="email-helper email-error" />
   <span id="email-helper">Helper text</span>
   <span id="email-error">Error message</span>
   ```

3. **aria-invalid** on error state
   ```typescript
   <input aria-invalid={hasError} />
   ```

4. **aria-required** for required fields
   ```typescript
   <input aria-required={required} required={required} />
   ```

5. **Visible focus states** in recipes
   ```typescript
   _focusVisible: {
     outlineWidth: '2',
     outlineColor: 'primary'
   }
   ```

## Form Component Examples

### Select Component

```typescript
export const Select: FC<SelectProps> = ({ options, ...props }) => {
  return (
    <Box
      as="select"
      className={select({ size: props.size })}
      {...props}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Box>
  )
}
```

### Textarea Component

```typescript
export const Textarea: FC<TextareaProps> = ({
  size,
  error,
  ...props
}) => {
  return (
    <Box
      as="textarea"
      className={textarea({ size })}
      data-error={error || undefined}
      aria-invalid={error}
      {...props}
    />
  )
}
```

### Radio Group

```typescript
export type RadioGroupProps = {
  name: string
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
}

export const RadioGroup: FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange
}) => {
  return (
    <Box display="flex" flexDirection="column" gap="12">
      {options.map(({ value: optionValue, label }) => (
        <Radio
          key={optionValue}
          name={name}
          value={optionValue}
          label={label}
          checked={value === optionValue}
          onChange={() => onChange?.(optionValue)}
        />
      ))}
    </Box>
  )
}
```

## Best Practices Checklist

- [ ] Use atomic components for individual form controls
- [ ] Compose molecular components for common patterns
- [ ] Use FormField wrapper for consistent layout and accessibility
- [ ] Generate unique IDs for label/input association
- [ ] Link help text and errors via aria-describedby
- [ ] Set aria-invalid on error states
- [ ] Test keyboard navigation (tab order)
- [ ] Test screen reader announcements
- [ ] Validate with jest-axe or similar tool
- [ ] Ensure consistent error prop interface across all components

## Common Pitfalls

### Avoid: Skipping FormField Wrapper

```typescript
// BAD: Manual label/error handling
<label htmlFor="email">Email</label>
<TextInput id="email" />
{error && <span>{error}</span>}

// GOOD: Use FormField for consistency
<FormField label="Email" errorText={error}>
  <TextInput />
</FormField>
```

### Avoid: Inconsistent Error Props

```typescript
// BAD: Different error handling per component
<TextInput hasError={true} />
<Select isInvalid={true} />
<CheckBox showError={true} />

// GOOD: Consistent error prop
<TextInput error={true} />
<Select error={true} />
<CheckBox error={true} />
```

### Avoid: Missing ARIA Attributes

```typescript
// BAD: No accessibility attributes
<input />
<span>Error message</span>

// GOOD: Proper ARIA linking
<input
  id="email"
  aria-invalid={true}
  aria-describedby="email-error"
/>
<span id="email-error">Error message</span>
```

## Testing Forms

### Keyboard Navigation

```typescript
test('form fields are keyboard navigable', async () => {
  render(<MyForm />)

  // Tab through fields
  await userEvent.tab()
  expect(screen.getByLabelText('Email')).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByLabelText('Password')).toHaveFocus()
})
```

### Screen Reader

```typescript
test('error messages are announced', async () => {
  render(<FormField label="Email" errorText="Invalid email">
    <TextInput />
  </FormField>)

  const input = screen.getByLabelText('Email')

  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAccessibleDescription('Invalid email')
})
```

### ARIA Validation

```typescript
import { axe } from 'jest-axe'

test('form has no accessibility violations', async () => {
  const { container } = render(<MyForm />)
  const results = await axe(container)

  expect(results).toHaveNoViolations()
})
```

## Next Steps

After building forms:

1. **Create Storybook stories**: Use **panda-create-stories** skill
2. **Review components**: Use **panda-review-component** skill
3. **Test accessibility**: Run axe and test keyboard navigation
