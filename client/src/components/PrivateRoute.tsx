import useUserInfo from '@/hooks/use-user-info'
import { Navigate} from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
  const { userInfo } = useUserInfo()
  
  return userInfo ? children : ( <Navigate to='/ '/>)
}

export default PrivateRoute 