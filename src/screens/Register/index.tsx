import React, { useState } from 'react'

import { Button } from '../../components/Forms/Button'
import { CategorySelect } from '../../components/Forms/CategorySelect'
import { Input } from '../../components/Forms/Input'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles'

export function Register() {
    const [transactionType, setTransactionType] = useState('')

    function handleTransactionTypeSelect(type: 'income' | 'outcome') {
        setTransactionType(type)
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <Input
                        placeholder='Nome'
                    />

                    <Input
                        placeholder='Preço'
                    />

                    <TransactionsTypes>
                        <TransactionTypeButton
                            type='income'
                            title='Income'
                            onPress={() => handleTransactionTypeSelect('income')}
                            isActive={transactionType === 'income'}
                        />
                        <TransactionTypeButton
                            type='outcome'
                            title='Outcome'
                            onPress={() => handleTransactionTypeSelect('outcome')}
                            isActive={transactionType === 'outcome'}
                        />
                    </TransactionsTypes>


                    <CategorySelect title='Categoria' />
                </Fields>

                <Button title='Enviar' />
            </Form>
        </Container>
    )
}