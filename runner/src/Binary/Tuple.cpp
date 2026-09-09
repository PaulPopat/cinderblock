#include "./Tuple.h"
#include "./LiteralString.h"

namespace Binary
{
  Tuple::Tuple(char *binary, int offset)
  {
    int end = offset;
    auto values = std::vector<TuplePart>();
    while (binary[end] != 0)
    {
      auto name = new LiteralString(binary, end + 1);
      auto value = Instruction::Parse(binary, name->get_end());

      values.push_back({name, value});
      end = value->get_end();
    }

    this->end = end + 1;
    this->values = values;
  }

  Tuple::~Tuple()
  {
    for (const auto &value : this->values)
    {
      delete value.name;
      delete value.value;
    }
  }

  const int Tuple::get_end() const
  {
    return this->end;
  }
}