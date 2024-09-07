import styled from 'styled-components'

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
