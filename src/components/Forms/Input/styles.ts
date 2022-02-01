import { RFValue } from 'react-native-responsive-fontsize'
import styled from 'styled-components/native'

export const Container = styled.TextInput`
    width: 100%;

    margin-bottom: 8px;
    padding: 18px 16px;
    border-radius: 5px;

    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};

    color: ${({ theme }) => theme.colors.text_dark};
    background-color: ${({ theme }) => theme.colors.shape};
`