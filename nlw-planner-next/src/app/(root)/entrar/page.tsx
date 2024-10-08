import LoginForm from '@/components/forms/login-form'
import Link from 'next/link'

export default function Entrar() {
  return (
    <div className='w-full space-y-4 md:max-w-md mx-auto'>
      <h1 className="text-lg font-bold">Insira seu email para continuar</h1>
      <LoginForm />
      <p className='text-center text-muted-foreground'>Não possui conta? <Link className='text-foreground' href='/registro'>Cadastre</Link></p>
    </div>
  )
}
