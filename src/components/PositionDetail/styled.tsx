import { Text } from 'rebass'
import styled from 'styled-components'
import { mediaWidth } from 'theme'

export const Wrapper = styled.div`
  padding: 20px;
  position: relative;
`

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary};
`
export const MaxButton = styled.button<{ width: string }>`
  background-color: ${({ theme }) => theme.module};
  border: 1px solid ${({ theme }) => theme.module};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  ${({ theme }) => mediaWidth.deprecated_upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-size: 1rem;
  font-weight: 535;
  margin: 0.25rem;
  overflow: hidden;
  padding: 0.5rem 1rem;
  :hover {
    border: 1px solid ${({ theme }) => theme.primary};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    animation: ellipsis 1.25s infinite;
    content: '.';
    display: inline-block;
    text-align: left;
    width: 1em;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export const LoadingRows = styled.div`
  grid-column-gap: 0.5em;
  grid-row-gap: 0.8em;
  grid-template-columns: repeat(3, 1fr);
  max-width: 960px;
  min-width: 75%;
  padding: 8px;
  padding-top: 36px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 3;
  }
  & > div:nth-child(4n) {
    grid-column: 3 / 4;
    margin-bottom: 2em;
  }
`
