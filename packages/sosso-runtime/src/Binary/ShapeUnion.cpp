#include "ShapeUnion.h"
#include "../Storage/VariableTuple.h"
#include "extract.h"

namespace Binary {
ShapeUnion::ShapeUnion(const char* binary, int offset)
{
  auto result = extract_array<const Shape*>(binary, offset, [](const char* binary, int offset) {
    auto value = Shape::Parse(binary, offset);
    ExtractArrayItemResult<const Shape*> result = {
      value,
      value->get_end()
    };
    return result;
  });

  this->end = result.offset;
  this->possible = result.data;
}

ShapeUnion::~ShapeUnion()
{
  for (const auto& value : this->possible) {
    delete value;
  }
}

const int ShapeUnion::get_end() const
{
  return this->end;
}

const bool ShapeUnion::matches(const Variable* subject) const
{
  for (const auto& part : this->possible) {
    if (part->matches(subject)) {
      return true;
    }
  }

  return false;
}
}
