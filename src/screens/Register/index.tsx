import React, { useState } from 'react'
import { Modal } from 'react-native'

import { Button } from '../../components/Forms/Button'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { Input } from '../../components/Forms/Input'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelect } from '../CategorySelect'

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
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria',
    })

    function handleTransactionTypeSelect(type: 'income' | 'outcome') {
        setTransactionType(type)
    }

    function handleCloseSetCategoryModal() {
        setCategoryModalOpen(false)
    }

    function handleOpenSetCategoryModal() {
        setCategoryModalOpen(true)
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


                    <CategorySelectButton
                        title={category.name}
                        onPress={handleOpenSetCategoryModal}
                    />
                </Fields>

                <Button title='Enviar' />
            </Form>

            <Modal
                visible={categoryModalOpen}
            >
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSetCategoryModal}
                />
            </Modal>
        </Container>
    )
}