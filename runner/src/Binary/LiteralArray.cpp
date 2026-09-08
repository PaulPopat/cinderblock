#include "./LiteralArray.h"

namespace Binary
{
  // This is highly wasteful and needs a rethink.
  LiteralArray::LiteralArray(char *binary, int offset)
  {
    int end = offset;
    int mem_length = 10;
    auto values = new Instruction *[mem_length];
    int index = 0;
    while (binary[end] != 0)
    {
      auto next = Instruction::Parse(binary, end + 1);

      values[index] = next;
      index = index + 1;
      end = next->get_end();
      if (index >= mem_length)
      {
        values = new Instruction *[mem_length + 10];
        mem_length += 10;
      }
    }

    this->end = end + 1;
    this->length = index + 1;
    this->values = values;
  }

  const int LiteralArray::get_end() const
  {
    return this->end;
  }
}