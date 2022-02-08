import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import uuid from 'react-native-uuid'

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
import { useAuth } from '../../hooks/auth'

type NavigationProps = {
    navigate: (screen: string) => void;
}

interface FormData {
    [name: string]: any;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('O valor deve ser maior que zero')
        .required('Valor é obrigatório'),
})

export function Register() {
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria',
    })

    const {
        control, // registrar os inputs no nosso form
        handleSubmit, // Recebe os valores de todos os inputs e faz um unico submit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    })

    const navigation = useNavigation<NavigationProps>()
    const { user } = useAuth()

    function handleTransactionTypeSelect(type: 'income' | 'outcome') {
        setTransactionType(type)
    }

    function handleCloseSetCategoryModal() {
        setCategoryModalOpen(false)
    }

    function handleOpenSetCategoryModal() {
        setCategoryModalOpen(true)
    }

    async function handleRegister(form: FormData) {
        if (!transactionType) return Alert.alert('Selecione o tipo da transação')

        if (category.key === 'category') return Alert.alert('Selecione a categoria')

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = `@gofinances:transactions_${user.id}`

            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset()
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'categoria',
            })

            navigation.navigate('Listagem')
        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível salvar')
        }
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name='name'
                            error={errors.name && errors.name.message}
                            control={control}
                            placeholder='Nome'
                            autoCapitalize='sentences'
                            autoCorrect={false}
                        />

                        <InputForm
                            name='amount'
                            error={errors.amount && errors.amount.message}
                            control={control}
                            placeholder='Preço'
                            keyboardType='numeric'
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton
                                type='income'
                                title='Entrada'
                                onPress={() => handleTransactionTypeSelect('income')}
                                isActive={transactionType === 'income'}
                            />
                            <TransactionTypeButton
                                type='outcome'
                                title='Saída'
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
        </TouchableWithoutFeedback >
    )
}