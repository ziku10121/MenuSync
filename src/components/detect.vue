<template>
  <div class="detect">
      <div class="item" v-for="i in 120" :key="i"></div>
    </div>
</template>
<script>
export default {
  
}
</script>
<style scoped>
  :root{
    --xmargin: 0px;
    --ymargin: 0px;
    --BubbleWidth: 20px;
    --BubbleHeight: 20px;
    --x:0px;
    --y:0px;
    --width:0px;
    --height:0px;
  }
  .detect{
    width: var(--width);
    height: var(--height);
    top:var(--y);
    left:var(--x);
    background-color: #fa0;
    position: absolute;
    display: flex;
    justify-content:space-between;
    align-content:space-between;
    opacity: 0.2;
  }
  .item{
    width: var(--BubbleWidth);
    height: var(--BubbleHeight);
    background-color: #f00;
    margin:var(--ymargin) var(--xmargin);
  }
</style>