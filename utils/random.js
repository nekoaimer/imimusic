export function random(num, index = num, type = 'floor'){
   let i = Math[type](Math.random() * num)
   while(index == i) i = random(num, index, type)
   return i
}