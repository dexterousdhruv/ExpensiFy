import useUserInfo from '@/hooks/use-user-info'
import { Navigate} from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

const DefaultRoute = ({ children }: Props) => {
  const { userInfo } = useUserInfo()
  
  return !userInfo ? children : ( <Navigate to='/main '/>)
}

export default DefaultRoute