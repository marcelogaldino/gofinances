import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

interface IAuthProviderProps {
    children: ReactNode
}

interface User {
    id: string
    name: string
    email: string
    photo?: string
}

interface IAuthContextData {
    user: User,
    signInWithGoogle(): Promise<void>
    signInWithApple(): Promise<void>
    SignOut(): Promise<void>
    userStorageLoading: boolean
}

interface IAuthorizationResponse {
    params: {
        access_token: string
    }
    type: string
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: IAuthProviderProps) {
    const [user, setUser] = useState<User>({} as User)
    const [userStorageLoading, setUserStorageLoading] = useState(true)

    const dataKey = '@gofinances:user'

    async function signInWithGoogle() {

        try {
            const RESPONSE_TYPE = 'token'
            const SCOPE = encodeURI('profile email')

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

            const { type, params } = await AuthSession.startAsync({ authUrl }) as IAuthorizationResponse

            if (type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
                const userInfo = await response.json()

                const userLogged = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                }

                setUser(userLogged)
                await AsyncStorage.setItem(dataKey, JSON.stringify(userLogged))
            }

        } catch (error) {
            throw new Error(String(error))
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            })

            if (credential) {
                const name = credential.fullName!.givenName!
                const familyName = credential.fullName?.familyName
                const photo = `https://ui-avatars.com/api/?name=${name}+${familyName}`

                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!, // o exclamacao forca dizermos que sempre teremos algo na variavel e nunca vai ser null
                    name,
                    photo,
                }

                setUser(userLogged)
                await AsyncStorage.setItem(dataKey, JSON.stringify(userLogged))
            }
        } catch (error) {
            throw new Error(String(error))
        }
    }

    async function SignOut() {
        setUser({} as User)
        await AsyncStorage.removeItem(dataKey)
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStoraged = await AsyncStorage.getItem(dataKey)

            if (userStoraged) {
                const userLogged = JSON.parse(userStoraged)
                setUser(userLogged)
            }
            setUserStorageLoading(false)
        }

        loadUserStorageData()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            SignOut,
            userStorageLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }