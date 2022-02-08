import React, { useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    LogoutButton,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LoadContainer
} from './styles'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth'

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface HighlightProps {
    amount: string,
    lastTransaction: string
}

interface HighlightData {
    entries: HighlightProps
    expensive: HighlightProps
    total: HighlightProps
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [transaction, setTransaction] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme()
    const { SignOut, user } = useAuth()

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'income' | 'outcome'
    ) {
        const lasTransaction = new Date(
            Math.max.apply(Math, collection
                .filter(itemCollection => itemCollection.type === type)
                .map(itemCollection => new Date(itemCollection.date).getTime())))

        return `${lasTransaction.getDate()} de ${lasTransaction.toLocaleString('pt-BR', { month: "long" })}`
    }

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)

        const transactions: DataListProps[] | [] = response ? JSON.parse(response) : []

        let entriesTotal = 0
        let expensiveTotal = 0
        let total = 0

        const transactionsFormatted = transactions
            .map((item: DataListProps) => {
                if (item.type === 'income') {
                    entriesTotal += Number(item.amount)
                } else {
                    expensiveTotal += Number(item.amount)
                }

                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date))

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            })

        total = entriesTotal - expensiveTotal

        setTransaction(transactionsFormatted)

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'income')
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'outcome')
        const totalInterval = `01 à ${lastTransactionsEntries}`

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada ${lastTransactionsEntries}`
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída ${lastTransactionsExpensives}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        })
        setIsLoading(false)
    }

    // atualiza a lista de transacoes ao navegar entre paginas
    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.primary} size="large" />
                    </LoadContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: user.photo }} />
                                    <User>
                                        <UserGreeting>Ola,</UserGreeting>
                                        <UserName>{user.name}</UserName>
                                    </User>
                                </UserInfo>

                                <LogoutButton onPress={SignOut}>
                                    <Icon name='power' />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>

                        <HighlightCards>
                            <HighlightCard
                                type='income'
                                title='Entradas'
                                amount={highlightData.entries?.amount}
                                lastTransaction={highlightData.entries.lastTransaction}
                            />
                            <HighlightCard
                                type='outcome'
                                title='Saídas'
                                amount={highlightData.expensive?.amount}
                                lastTransaction={highlightData.expensive.lastTransaction}
                            />
                            <HighlightCard
                                type='total'
                                title='Total'
                                amount={highlightData.total?.amount}
                                lastTransaction={highlightData.total.lastTransaction}
                            />
                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={transaction}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />
                        </Transactions>
                    </>
            }
        </Container>
    )
}