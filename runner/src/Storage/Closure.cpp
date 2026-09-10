#include "Closure.h"

namespace Storage {
Closure::Closure(Frame* globals, std::vector<Frame*> frames)
{
  this->globals = globals;
  this->frames = frames;
}

Closure::~Closure()
{
}

const Variable* Closure::search(std::string name)
{
  for (const auto& frame : this->frames) {
    auto possible = frame->search(name);
    if (possible != nullptr) {
      return possible;
    }
  }

  throw "Variable not resolved";
}

Closure* Closure::with_frame(Frame* frame)
{
  auto input = std::vector<Frame*>();
  for (const auto& frame : this->frames) {
    input.push_back(frame);
  }

  input.push_back(frame);

  return new Closure(this->globals, input);
}

Closure* Closure::add_variable(std::string name, const Variable* value)
{
  auto frame = *this->frames.end();
  frame->add_variable(name, value);
  return this;
}

const Variable* Closure::add_temp_variable(const Variable* value)
{
  auto frame = *this->frames.end();
  frame->add_temp_variable(value);
  return value;
}

const Variable* Closure::search_global(std::string name)
{
  auto possible = this->globals->search(name);
  if (possible != nullptr) {
    return possible;
  }

  throw "Global not resolved";
}
}
