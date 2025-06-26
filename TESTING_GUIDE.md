# 📚 Instrukcja użytkowania testów jednostkowych

## 🚀 **Szybki start**

### 1. Instalacja pakietów testowych
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

### 2. Uruchomienie wszystkich testów
```bash
npm test
```

### 3. Uruchomienie testów w trybie watch (automatyczne przeładowanie)
```bash
npm run test:watch
```

### 4. Uruchomienie testów z pokryciem kodu
```bash
npm run test:coverage
```

### 5. Uruchomienie testów dla CI/CD
```bash
npm run test:ci
```

## 📋 **Dostępne komendy**

| Komenda | Opis |
|---------|------|
| `npm test` | Uruchamia wszystkie testy jeden raz |
| `npm run test:watch` | Uruchamia testy w trybie obserwowania zmian |
| `npm run test:coverage` | Generuje raport pokrycia kodu |
| `npm run test:ci` | Uruchamia testy dla środowiska CI/CD |

## 🎯 **Uruchamianie konkretnych testów**

### Uruchomienie testów dla konkretnego pliku:
```bash
npm test -- player-setup.test.tsx
```

### Uruchomienie testów dla konkretnej funkcji:
```bash
npm test -- --testNamePattern="renders welcome message"
```

### Uruchomienie testów dla konkretnego folderu:
```bash
npm test -- src/components/__tests__
```

### Uruchomienie testów w trybie verbose (szczegółowy):
```bash
npm test -- --verbose
```

## 🔍 **Interpretacja wyników**

### ✅ **Wszystkie testy przeszły:**
```
PASS  src/components/__tests__/player-setup.test.tsx
PASS  src/components/__tests__/quiz-settings.test.tsx
PASS  src/components/__tests__/question-card.test.tsx

Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.534 s
```

### ❌ **Niektóre testy nie przeszły:**
```
 FAIL  src/components/__tests__/player-setup.test.tsx
  PlayerSetup Component
    ✓ renders welcome message and input field
    ✗ calls onPlayerSetup with entered name on form submit

  ● PlayerSetup Component › calls onPlayerSetup with entered name on form submit

    expect(jest.fn()).toHaveBeenCalledWith("John Doe")

    Expected: "John Doe"
    Received: "Anonymous Tiger"
```

### 📊 **Raport pokrycia kodu:**
```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |   89.47 |    83.33 |   88.89 |   89.47 |                   
 components           |   95.24 |    90.91 |   100   |   95.24 |                   
  player-setup.tsx    |   95.24 |    90.91 |   100   |   95.24 | 42                
 hooks                |   85.71 |    77.78 |   80    |   85.71 |                   
  use-quiz.ts         |   85.71 |    77.78 |   80    |   85.71 | 156,162          
----------------------|---------|----------|---------|---------|-------------------
```

## 🛠️ **Debugowanie testów**

### 1. Dodanie console.log w testach:
```typescript
test('debug test', () => {
  const { result } = renderHook(() => useQuiz())
  console.log('Current state:', result.current)
  expect(result.current.gamePhase).toBe('player-setup')
})
```

### 2. Użycie screen.debug() do wyświetlenia DOM:
```typescript
test('debug DOM', () => {
  render(<PlayerSetup {...mockProps} />)
  screen.debug() // Wyświetla aktualny stan DOM
})
```

### 3. Uruchomienie pojedynczego testu:
```typescript
test.only('this test only', () => {
  // Tylko ten test zostanie uruchomiony
})
```

### 4. Pominięcie testu:
```typescript
test.skip('skip this test', () => {
  // Ten test zostanie pominięty
})
```

## 📈 **Najlepsze praktyki**

### 1. **Organizacja testów:**
```typescript
describe('ComponentName', () => {
  describe('when user is logged in', () => {
    test('should display welcome message', () => {
      // test implementation
    })
  })

  describe('when user is not logged in', () => {
    test('should display login form', () => {
      // test implementation
    })
  })
})
```

### 2. **Setup i Cleanup:**
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Wykonuje się przed każdym testem
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Wykonuje się po każdym tescie
    cleanup()
  })
})
```

### 3. **Async/Await w testach:**
```typescript
test('async operation', async () => {
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### 4. **User interactions:**
```typescript
test('user interaction', async () => {
  const user = userEvent.setup()
  render(<Component />)
  
  await user.click(screen.getByRole('button'))
  await user.type(screen.getByRole('textbox'), 'Hello')
})
```

## 🎯 **Co testować:**

### ✅ **Testuj:**
- Renderowanie komponentów
- Interakcje użytkownika
- Logikę biznesową
- Obsługę błędów
- Stany loading/error
- API calls
- Walidację danych

### ❌ **Nie testuj:**
- Implementacji CSS
- Third-party libraries
- Prostych getterów/setterów
- Konfiguracji Next.js

## 🚨 **Częste problemy i rozwiązania**

### Problem: "Cannot find module '@testing-library/react'"
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Problem: "ReferenceError: fetch is not defined"
Dodaj do `jest.setup.js`:
```javascript
global.fetch = jest.fn()
```

### Problem: "Cannot find name 'jest'"
```bash
npm install --save-dev @types/jest
```

### Problem: Test timeout
Zwiększ timeout:
```typescript
test('long running test', async () => {
  // test code
}, 10000) // 10 sekund timeout
```

## 🎉 **Gratulacje!**

Teraz masz pełną konfigurację testów dla aplikacji Next.js! 

**Pamiętaj:**
- Uruchamiaj testy regularnie
- Dodawaj testy dla nowych funkcji
- Utrzymuj wysokie pokrycie kodu (>90%)
- Testuj edge cases i błędy
- Przeglądaj raporty pokrycia
