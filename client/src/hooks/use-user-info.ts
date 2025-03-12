import { useLocalStorage } from 'usehooks-ts'

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useLocalStorage("user", '')

  return { userInfo, setUserInfo }
}

export default useUserInfo as any