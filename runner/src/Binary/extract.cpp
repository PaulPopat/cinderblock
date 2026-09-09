#include "./extract.h"
#include <cstdlib>

namespace Binary
{
  void *extract(char *binary, int offset, unsigned long size)
  {
    void *value = malloc(size);
    char *value_char = (char *)value;
    for (auto i = 0; i < size; i++)
    {
      value_char[i] = binary[offset + i];
    }

    return value;
  }
}