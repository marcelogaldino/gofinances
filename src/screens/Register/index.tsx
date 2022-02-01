import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from 'react-native'

import { Button } from '../../components/Forms/Button'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { InputForm } from '../../components/Forms/InputForm'
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

interface FormData {
    [name: string]: any;
}

export function Register() {
    const {
        control, // registrar os inputs no nosso form
        handleSubmit, // Recebe os valores de todos os inputs e faz um unico submit
    } = useForm()

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

    function handleRegister(form: FormData) {
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.name
        }
        console.log(data)
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <InputForm
                        name='name'
                        control={control}
                        placeholder='Nome'
                        autoCapitalize='sentences'
                        autoCorrect={false}
                    />

                    <InputForm
                        name='amount'
                        control={control}
                        placeholder='Preço'
                        keyboardType='numeric'
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

                <Button
                    title='Enviar'
                    onPress={handleSubmit(handleRegister)}
                />
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