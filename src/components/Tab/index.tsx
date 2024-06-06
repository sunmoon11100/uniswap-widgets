import styled, { DefaultTheme, ThemedStyledProps } from 'styled-components'

// Define the props for the Tab component
interface TabProps
  extends ThemedStyledProps<
    Pick<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'key' | keyof React.ButtonHTMLAttributes<HTMLButtonElement>
    > & {
      active?: boolean
    },
    DefaultTheme
  > {}

// Tabs component
export const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`

// Tab component
export const Tab = styled.button<TabProps>`
  padding: 10px 20px;
  border: none;
  background-color: ${(props) => (props.active ? '#f1f1f1' : 'transparent')};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`
