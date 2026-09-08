#include "./alloc.h"

extern unsigned char __heap_base;

unsigned long bump_pointer = __heap_base;
unsigned long dynamic_base = __heap_base;

namespace Core
{
  void *alloc(unsigned long n)
  {
    unsigned long r = bump_pointer;
    bump_pointer += n;
    return (void *)r;
  }

  void loaded_binary()
  {
    dynamic_base = bump_pointer;
  }

  void finish_function()
  {
    bump_pointer = dynamic_base;
  }
}
