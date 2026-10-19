#include "ShapePipeable.h"
#include "../Storage/VariablePipeable.h"
#include "extract.h"

namespace Binary {
ShapePipeable::ShapePipeable(const char* binary, int offset)
{
  auto args = extract_array<const ShapeArg*>(binary, offset, [](const char* binary, int offset) {
    auto value = new ShapeArg(binary, offset);
    ExtractArrayItemResult<const ShapeArg*> result = {
      value,
      value->get_end()
    };
    return result;
  });

  this->args = args.data;
  this->returns = Shape::Parse(binary, args.offset);
  this->end = this->returns->get_end();
}

ShapePipeable::~ShapePipeable()
{
}

const int ShapePipeable::get_end() const
{
  return this->end;
}

const bool ShapePipeable::matches(const Variable* subject) const
{
  auto possible = VariablePipeable::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
