#include "./extract.h"
#include "../Core/alloc.h"

namespace Binary
{
  void *extract(char *binary, int offset, unsigned long size)
  {
    void *value = Core::alloc(size);
    char *value_char = (char *)value;
    for (auto i = 0; i < sizeof(double); i++)
    {
      value_char[i] = binary[offset + i];
    }

    return value;
  }
}