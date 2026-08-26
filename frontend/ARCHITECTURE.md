# Estrutura do Frontend - JobFinder

## Arquitetura

```
frontend/src/
├── components/          # Componentes reutilizáveis globais
│   ├── Footer/          # Footer padrão da aplicação
│   ├── Layout/          # Componentes de layout
│   │   ├── AuthLayout/      # Layout para páginas de autenticação
│   │   ├── DashboardLayout/ # Layout para dashboards
│   │   └── PageLayout/      # Layout base
│   ├── Navbar/          # Navbar da aplicação
│   └── ui/              # Componentes de UI genéricos
│       └── Modal/       # Modal genérico reutilizável
│
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Hook de autenticação
│   ├── useCandidato.js  # Hook de operações do candidato
│   ├── useEmpresa.js    # Hook de operações da empresa
│   └── useVagas.js      # Hook de busca de vagas
│
├── pages/               # Páginas da aplicação
│   ├── [PageName]/
│   │   ├── PageName.jsx
│   │   ├── PageName.module.css
│   │   └── components/  # Componentes específicos da página
│   │       └── ComponentName/
│   │           ├── ComponentName.jsx
│   │           └── ComponentName.module.css
│
├── services/            # Camada de serviços API
│   ├── api.js           # Wrapper fetch com tratamento de erros
│   ├── authService.js   # Endpoints de autenticação
│   ├── candidatoService.js  # Endpoints do candidato
│   ├── empresaService.js    # Endpoints da empresa
│   └── vagasService.js      # Endpoints de vagas
│
├── styles/              # Estilos globais
│   └── global.css
│
├── App.jsx              # Componente raiz com rotas
└── main.jsx             # Entry point
```

## Padrões

### Nomenclatura de Arquivos
- Componentes: `PascalCase.jsx`
- Estilos: `PascalCase.module.css`
- Hooks: `camelCase.js` (prefixo `use`)
- Services: `camelCase.js` (sufixo `Service`)

### Imports
- Imports diretos para arquivos `.jsx` (sem barrel exports)
- Services e hooks usam barrel exports via `index.js`

```jsx
// Componentes - import direto
import Modal from '../../components/ui/Modal/Modal'

// Services - via barrel export
import { candidatoService, authService } from '../../services'

// Hooks - via barrel export
import { useAuth, useCandidato } from '../../hooks'
```

### Estrutura de Componente
```jsx
// imports
import { useState } from 'react'
import styles from './Component.module.css'

// componente
function Component({ prop1, prop2 }) {
  // hooks
  const [state, setState] = useState()

  // handlers
  const handleClick = () => {}

  // render
  return (
    <div className={styles.container}>
      {/* ... */}
    </div>
  )
}

export default Component
```

### Estrutura de Service
```js
import { api } from './api'

export const nomeService = {
  async metodo(params) {
    return api.get('/endpoint', params)
  }
}
```

### Estrutura de Hook
```js
import { useState, useCallback } from 'react'
import { nomeService } from '../services'

export function useNome() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await nomeService.metodo()
      setData(result)
      return { success: true, data: result }
    } catch (err) {
      setError(err.data?.error || 'Erro')
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, data, fetchData }
}
```

## Convenções

### CSS Modules
- Usar CSS Modules para estilos locais
- Classes em camelCase: `styles.containerClass`
- Variáveis CSS globais definidas em `styles/global.css`

### Tratamento de Erros
- Services lançam erros com `{ status, data }`
- Componentes capturam via try/catch
- Exibir mensagens amigáveis: `error.data?.error || 'Mensagem padrão'`

### Formulários
- Usar FormData para uploads de arquivo
- Validação client-side antes de submit
- Feedback visual durante loading (disabled buttons)
