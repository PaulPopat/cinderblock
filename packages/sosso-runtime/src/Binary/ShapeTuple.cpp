#include "ShapeTuple.h"
#include "extract.h"
#include "../Storage/VariableTuple.h"

namespace Binary {
ShapeTuple::ShapeTuple(const char* binary, int offset)
{
  auto result = extract_array<ShapeTuplePart>(binary, offset, [](const char* binary, int offset) {
    auto name = new LiteralString(binary, offset);
    auto value = Shape::Parse(binary, name->get_end());
    ExtractArrayItemResult<ShapeTuplePart> result = {
      { name, value },
      value->get_end()
    };
    return result;
  });

  this->end = result.offset;
  this->values = result.data;
}

ShapeTuple::~ShapeTuple()
{
  for (const auto& value : this->values) {
    delete value.name;
    delete value.value;
  }
}

const int ShapeTuple::get_end() const
{
  return this->end;
}

const bool ShapeTuple::matches(const Variable* subject) const
{
  auto possible = VariableTuple::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  for (const auto& part : this->values) {
    auto candidate = possible->get(part.name->get_value());
    if (!part.value->matches(candidate)) {
      return false;
    }
  }

  return true;
}
}
