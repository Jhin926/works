<template>
  <div class="loading">
    <div class="loading-inner">
      <div class="ripple ripple1"></div>
      <div class="ripple ripple2"></div>
      <div class="ripple ripple3"></div>
      <div class="ripple ripple4"></div>
    </div>
  </div>
</template>
<style scoped>
  @keyframes loadin {
    from {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(40, 40);
    }
    to {
      transform: scale(1, 1);
    }
  }
  @keyframes ripple {
    to {
      transform: scale(1);
    }
  }
  .loading {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: #f7f7f7;
  }
  .loading-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1px;
    height: 1px;
    background-color: #fff;
    border-radius: .08rem;
    -webkit-border-radius: .08rem;
    -moz-border-radius: .08rem;
  }
  .loading-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    background-color: #f5a623;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    margin: .8rem auto .6rem auto;
    animation: loadin 2s linear infinite;
    -webkit-animation: loadin 2s linear infinite;
    -moz-animation: loadin 2s linear infinite;
  }
  .ripple {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    position: absolute;
    top: calc(50% - 30px);
    left: calc(50% - 30px);
    animation-name: ripple;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-direction: alternate-reverse;
    animation-iteration-count: infinite;
    transform: scale(0);
    opacity: 0.6;
  }
  .ripple1 {
    background-color: #fecf33;
  }
  .ripple2 {
    animation-delay: -250ms;
    background-color: #fdbd39;
  }
  .ripple3 {
    animation-delay: -500ms;
    background-color: #f69833;
  }
  .ripple4 {
    animation-delay: -750ms;
    background-color: #ee6723;
  }
  .loading-img1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    background-color: red;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    margin: .8rem auto .6rem auto;
    animation: loadin 2s linear 0.5s infinite;
  }
  .loading-img2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    background-color: #f5a623;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    margin: .8rem auto .6rem auto;
    animation: loadin 2s linear 1s infinite;
  }
  .loading-img3 {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    background-color: #f9cd0b;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    margin: .8rem auto .6rem auto;
    animation: loadin 2s linear 1.5s infinite;
  }
  .loading-text {
    text-align: center;
    font-size: .28rem;
  }
</style>
