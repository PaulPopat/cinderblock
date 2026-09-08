#include "string_equals.h"

namespace Core
{
  bool Core::string_equals(char *left, char *right)
  {
    int index = 0;
    // 3 is end of text according to the ascii standard so we use that when encoding strings
    while (left[index] != 3)
    {
      if (left[index] != right[index])
      {
        return false;
      }

      index += 1;
    }

    return left[index] == 3 && right[index] == 3;
  }
}