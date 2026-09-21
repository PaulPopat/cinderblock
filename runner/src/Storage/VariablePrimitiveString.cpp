#include "VariablePrimitiveString.h"
#include "VariablePrimitiveBool.h"
#include "VariablePrimitiveNull.h"
#include "VariableTuple.h"

namespace Storage {
VariablePrimitiveString::VariablePrimitiveString(std::string value)
{
  this->value = value;
}

VariablePrimitiveString::VariablePrimitiveString(val value)
{
  this->value = value.as<std::string>();
}

const val VariablePrimitiveString::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

std::string VariablePrimitiveString::get_value() const
{
  return this->value;
}

std::string VariablePrimitiveString::get_string() const
{
  return this->value;
}

const Variable* VariablePrimitiveString::operate_add(const Variable* right) const
{
  auto result = this->value;
  return new VariablePrimitiveString(result.append(right->get_string()));
}

const Variable* VariablePrimitiveString::operate_in(const Variable* right) const
{
  return new VariablePrimitiveBool(
    VariableTuple::FromVariable(right)
      ->get(this->value)
      ->get_type_name()
    != VariablePrimitiveNull::TypeName
  );
}

const Variable* VariablePrimitiveString::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value.compare(right->get_string()) == 0);
}

const Variable* VariablePrimitiveString::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value.compare(right->get_string()) != 0);
}
}
