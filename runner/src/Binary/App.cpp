#include "App.h"
#include "Access.h"
#include "Arg.h"
#include "ArrayAdd.h"
#include "CreateFunc.h"
#include "External.h"
#include "Is.h"
#include "LiteralArray.h"
#include "LiteralBool.h"
#include "LiteralChar.h"
#include "LiteralDouble.h"
#include "LiteralFloat.h"
#include "LiteralInt.h"
#include "LiteralLong.h"
#include "LiteralNull.h"
#include "LiteralString.h"
#include "Index.h"
#include "Not.h"
#include "Operator.h"
#include "Reference.h"
#include "Ternary.h"
#include "Tuple.h"
#include "extract.h"
#include "Shape.h"
#include "ShapeArray.h"
#include "ShapeBool.h"
#include "ShapeChar.h"
#include "ShapeDouble.h"
#include "ShapeFloat.h"
#include "ShapeInt.h"
#include "ShapeLong.h"
#include "ShapeNull.h"
#include "ShapePipeable.h"
#include "ShapeString.h"
#include "ShapeTuple.h"
#include "ShapeUnknown.h"
#include "ShapeUnion.h"
#include "../Storage/VariablePipeable.h"
#include <string>

namespace Binary {
App::App(const char* binary)
{
  Instruction::Register(Access::TypeName, [](const char* binary, int offset) {
    return new Access(binary, offset);
  });
  Instruction::Register(Arg::TypeName, [](const char* binary, int offset) {
    return new Arg(binary, offset);
  });
  Instruction::Register(ArrayAdd::TypeName, [](const char* binary, int offset) {
    return new ArrayAdd(binary, offset);
  });
  Instruction::Register(External::TypeName, [](const char* binary, int offset) {
    return new External(binary, offset);
  });
  Instruction::Register(LiteralArray::TypeName, [](const char* binary, int offset) {
    return new LiteralArray(binary, offset);
  });
  Instruction::Register(LiteralBool::TypeName, [](const char* binary, int offset) {
    return new LiteralBool(binary, offset);
  });
  Instruction::Register(LiteralChar::TypeName, [](const char* binary, int offset) {
    return new LiteralChar(binary, offset);
  });
  Instruction::Register(LiteralDouble::TypeName, [](const char* binary, int offset) {
    return new LiteralDouble(binary, offset);
  });
  Instruction::Register(LiteralFloat::TypeName, [](const char* binary, int offset) {
    return new LiteralFloat(binary, offset);
  });
  Instruction::Register(LiteralInt::TypeName, [](const char* binary, int offset) {
    return new LiteralInt(binary, offset);
  });
  Instruction::Register(LiteralLong::TypeName, [](const char* binary, int offset) {
    return new LiteralLong(binary, offset);
  });
  Instruction::Register(LiteralNull::TypeName, [](const char* binary, int offset) {
    return new LiteralNull(binary, offset);
  });
  Instruction::Register(LiteralString::TypeName, [](const char* binary, int offset) {
    return new LiteralString(binary, offset);
  });
  Instruction::Register(Not::TypeName, [](const char* binary, int offset) {
    return new Not(binary, offset);
  });
  Instruction::Register(Operator::TypeName, [](const char* binary, int offset) {
    return new Operator(binary, offset);
  });
  Instruction::Register(Reference::TypeName, [](const char* binary, int offset) {
    return new Reference(binary, offset);
  });
  Instruction::Register(Ternary::TypeName, [](const char* binary, int offset) {
    return new Ternary(binary, offset);
  });
  Instruction::Register(Tuple::TypeName, [](const char* binary, int offset) {
    return new Tuple(binary, offset);
  });
  Instruction::Register(Is::TypeName, [](const char* binary, int offset) {
    return new Is(binary, offset);
  });
  Instruction::Register(Index::TypeName, [](const char* binary, int offset) {
    return new Index(binary, offset);
  });

  Shape::Register(ShapeArray::TypeName, [](const char* binary, int offset) {
    return new ShapeArray(binary, offset);
  });
  Shape::Register(ShapeBool::TypeName, [](const char* binary, int offset) {
    return new ShapeBool(binary, offset);
  });
  Shape::Register(ShapeChar::TypeName, [](const char* binary, int offset) {
    return new ShapeChar(binary, offset);
  });
  Shape::Register(ShapeDouble::TypeName, [](const char* binary, int offset) {
    return new ShapeDouble(binary, offset);
  });
  Shape::Register(ShapeFloat::TypeName, [](const char* binary, int offset) {
    return new ShapeFloat(binary, offset);
  });
  Shape::Register(ShapeInt::TypeName, [](const char* binary, int offset) {
    return new ShapeInt(binary, offset);
  });
  Shape::Register(ShapeLong::TypeName, [](const char* binary, int offset) {
    return new ShapeLong(binary, offset);
  });
  Shape::Register(ShapeNull::TypeName, [](const char* binary, int offset) {
    return new ShapeNull(binary, offset);
  });
  Shape::Register(ShapePipeable::TypeName, [](const char* binary, int offset) {
    return new ShapePipeable(binary, offset);
  });
  Shape::Register(ShapeString::TypeName, [](const char* binary, int offset) {
    return new ShapeString(binary, offset);
  });
  Shape::Register(ShapeTuple::TypeName, [](const char* binary, int offset) {
    return new ShapeTuple(binary, offset);
  });
  Shape::Register(ShapeUnknown::TypeName, [](const char* binary, int offset) {
    return new ShapeUnknown(binary, offset);
  });
  Shape::Register(ShapeUnion::TypeName, [](const char* binary, int offset) {
    return new ShapeUnion(binary, offset);
  });

  auto functions = extract_array<const CreateFunc*>(binary, 0, [](const char* binary, int offset) {
    auto final = new CreateFunc(binary, offset);
    ExtractArrayItemResult<const CreateFunc*> result = {
      final,
      final->get_end()
    };

    return result;
  });

  this->functions = functions.data;
}

App::~App()
{
  for (const auto& func : this->functions) {
    delete func;
  }
}

std::vector<const CreateFunc*> App::get_functions() const
{
  return this->functions;
}

const CreateFunc* App::find(std::string name) const
{
  for (const auto& func : this->functions) {
    if (func->get_name().compare(name) == 0) {
      return func;
    }
  }

  throw "Func not found";
}
}
