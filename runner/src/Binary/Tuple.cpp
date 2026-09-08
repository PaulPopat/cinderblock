#include "./Tuple.h"
#include "./LiteralString.h"

namespace Binary
{
  // This is highly wasteful and needs a rethink.
  Tuple::Tuple(char *binary, int offset)
  {
    int end = offset;
    int mem_length = 10;
    auto names = new LiteralString *[mem_length];
    auto values = new Instruction *[mem_length];
    int index = 0;
    while (binary[end] != 0)
    {
      auto name = new LiteralString(binary, end + 1);
      auto next = Instruction::Parse(binary, name->get_end());

      values[index] = next;
      names[index] = name;
      index = index + 1;
      end = next->get_end();
      if (index >= mem_length)
      {
        names = new LiteralString *[mem_length + 10];
        values = new Instruction *[mem_length + 10];
        mem_length += 10;
      }
    }

    this->end = end + 1;
    this->length = index + 1;
    this->values = values;
  }

  const int Tuple::get_end() const
  {
    return this->end;
  }
}