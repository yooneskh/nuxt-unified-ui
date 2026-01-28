import { Comment, Fragment, Text, type Slot } from 'vue';


export function isSlotFilled(slot: Slot | undefined) {

  if (!slot) {
    return false;
  }

  return slot({}).some(vnode => {

    if (vnode.type === Comment) {
      return false;
    }

    if (vnode.type === Fragment && Array.isArray(vnode.children) && !vnode.children.length) {
      return false;
    }

    if (vnode.type === Text && typeof vnode.children === 'string' && vnode.children.trim() === '') {
      return false;
    }

    return true;

  });

}
