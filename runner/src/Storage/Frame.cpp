#include "Frame.h"
#include <string>

namespace Storage {
Frame* Frame::From(val data)
{
  auto result = new Frame();
  for (const auto& pair : vecFromJSArray<val>(data)) {
    auto name = pair["name"].as<std::string>();
    result->add_variable(name, Variable::Parse(pair["value"]));
  }

  return result;
}

Frame::Frame()
{
  this->data = new std::vector<VariableTuplePart>();
  this->temp = new std::vector<const Variable*>();
}

Frame::~Frame()
{
  for (const auto& pair : *this->data) {
    delete pair.value;
  }

  delete this->data;

  for (const auto& val : *this->temp) {
    delete val;
  }

  delete this->temp;
}

const Variable* Frame::search(std::string name) const
{
  for (const auto& variable : *this->data) {
    if (variable.name.compare(name) == 0) {
      return variable.value;
    }
  }

  return nullptr;
}

Frame* Frame::add_variable(std::string name, const Variable* value)
{
  this->data->push_back({ name, value });
  return this;
}

Frame* Frame::add_temp_variable(const Variable* value)
{
  this->temp->push_back(value);
  return this;
}

Frame* Frame::merge(const Frame* input)
{
  for (const auto& variable : *input->data) {
    this->add_variable(variable.name, variable.value);
  }

  return this;
}

const val Frame::raw() const
{
  auto result = val::object();

  for (const auto& part : *this->data) {
    result.set(part.name, part.value->raw());
  }

  return result;
}
}
